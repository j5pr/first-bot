import discord, { TextChannel } from 'discord.js'

import { Args, Client, Command, Elevation, Embed, Event, Category } from '../model'

import { words } from '../config/swears.json'

export default new class Message extends Event {
  public name: string = 'message'

  public async run(client: Client, message: discord.Message): Promise<void> {
    const guild = client.data.ensure(message.guild.id, client.data.defaults)
    const { settings } = guild

    if (message.author.bot) {
      return
    }

    if (settings.filter.enabled === true) {
      let filtered = this.filter(message.content)

      if (filtered !== message.content.toLowerCase()) {
        return void Promise.all([
          await message.reply('please do not swear! Filtered message:\n```' + `${message.member.displayName}: ${filtered}` + '```'),
          await message.delete(1000)
        ])
      }
    }

    if (!message.content.startsWith(settings.prefix)) {
      return
    }

    const params = message.content.slice(settings.prefix.length).trim().split(/ +/g) || []
    const cmd = (params.shift() || '').toLowerCase()

    for (const command of client.commands) {
      if (command.name !== cmd && !command.aliases.includes(cmd)) {
        continue
      }

      const elevation = await client.elevation(message.author, message.guild)

      if (!Client.allowed(elevation, command.elevation)) {
        return void message.channel.send(Embed.error('You do not have permissions to execute this command!', message.author)
          .addField('**Permissions**', `Required: ${command.elevation.toString(16).padStart(2, '0').toUpperCase()}\nYou have: ${elevation.toString(16).toUpperCase()}`))
      }

      const args = command.yargs
        .strict()
        .help(false)
        .exitProcess(false)
        .parse(params, {}, (err: any, argv: Args, output: string) => {
          if (err) {
            argv._fail = err.message
          }
        })

      if (args._fail != null) {
        return void message.channel.send(Embed.error(args._fail as any, message.author))
      }

      client.logger.info(`${settings.prefix}${command.name} has been run by ${message.author.tag} with arguments "${params.join(' ')}" in server ${message.guild.name}`)

      message.channel.startTyping()

      try {
        await command.run(client, message, args, guild)
      } catch (e) {
        await message.channel.send({ embed: Embed.error('There was a problem running the command:\n' + e.toString(), message.author) })
      }

      message.channel.stopTyping()

      client.data.set(message.guild.id, guild)

      await this.log(command, elevation, message, params, guild)
    }
  }

  private filter(message: string): string {
    let filtered = message.toLowerCase()

    for (let word of words) {
      filtered = filtered.split(word).join('[*BAWK*]')
    }

    return filtered
  }

  private async log(command: Command, elevation: Elevation, message: discord.Message, args: string[], settings: Client.Guild) {
    const { guild, author } = message

    if (command.category === Category.BOT || command.category === Category.MODERATION) {
      return
    }

    const channel = guild!.channels.find((c) => c.type === 'text' && (c.name === settings.settings.logs.standard || c.id === settings.settings.logs.standard)) as TextChannel

    if (!channel) {
      return
    }

    channel.startTyping()
    await channel.send({ embed: Embed.log(command, elevation, args, author, 'info', author) })
    channel.stopTyping()
  }
}
