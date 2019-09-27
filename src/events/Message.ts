import discord, { TextChannel } from 'discord.js'

import { Args, Client, Command, Elevation, Embed, Event, Category } from '../model'

const { words }: { words: string[] } = require('../../assets/word-filter.json')

export default new class Message extends Event {
  public name: string = 'message'

  public async run(client: Client, message: discord.Message): Promise<void> {
    if (message.author.bot || await this.filter(message)) {
      return
    }

    const guild = client.data.ensure(message.guild.id, { ...client.data.defaults })
    const { settings } = guild

    if (!message.content.startsWith(settings.prefix)) {
      return
    }

    const params = message.content.slice(settings.prefix.length).trim().split(/ +/g) || []
    const cmd = (params.shift() || '').toLowerCase()

    for (let command of client.commands) {
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
        .parse(params, {}, (err, argv, output) => {
          if (err) {
            argv._fail = err.message
          }
        })

      if (args._fail != null) {
        return void message.channel.send(Embed.error(args._fail as any, message.author))
      }

      client.logger.info(`${settings.prefix}${command.name} has been run by ${message.author.tag} with arguments [${args._.join(', ')}] in server ${message.guild.name}`)

      message.channel.startTyping()

      try {
        await command.run(client, message, args, guild)
      } catch (e) {
        await message.channel.send({ embed: Embed.error('There was a problem running the command:\n' + e.toString(), message.author) })
      }

      message.channel.stopTyping()

      client.data.set(message.guild.id, guild)

      await this.log(command, elevation, message, params, guild)

      return
    }
  }

  private async filter(message: discord.Message): Promise<boolean> {
    let filtered = message.content.toLowerCase()

    for (let word of words) {
      filtered = filtered.split(word).join('[*BAWK*]')
    }

    if (message.content.toLowerCase() !== filtered) {
      message.delete(1000)

      await message.reply('please do not swear! Filtered message:\n```' + `${message.member.displayName}: ${filtered}` + '```')

      return true
    }

    return false
  }

  private async log(command: Command, elevation: Elevation, message: discord.Message, args: string[], settings: Client.Guild) {
    const { guild, author } = message

    if (command.category === Category.BOT || command.category === Category.MODERATION) {
      return
    }

    const channel = guild.channels.find((c) => c.type === 'text' && (c.name === settings.settings.logs.standard || c.id === settings.settings.logs.standard)) as TextChannel

    if (!channel) {
      return
    }

    channel.startTyping()
    await channel.send({ embed: Embed.log(command, elevation, args, author, 'info', author) })
    channel.stopTyping()
  }
}
