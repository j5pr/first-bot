import { Message, TextChannel } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Pardon extends Command {
  public name: string = 'pardon'
  public aliases: string[] = ['unban']
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.ADMINISTRATOR

  public description: string = 'Pardon a user'
  public usage: string = 'pardon <userid> [reason]'

  public options = []

  public async run(client: Client, message: Message, args: Args, settings: Client.Guild): Promise<void> {
    const { author, guild } = message

    if (args._.length < 1) {
      return void await this.args(message)
    }

    if (args._[0] === author.id) {
      return void message.channel.send({ embed: Embed.error('Cannot pardon yourself!', author) })
    }

    const reason = args._.slice(1).join(' ') || 'None'

    let user
    try {
      user = (await guild.fetchBans()).find((u) => u.id === args[0])
      // await (await user.createDM()).send({
      //   embed: Embed.info()
      //     .addField('Unban Notice', 'You have been unbanned from **${guild.name}**')
      //     .addField('Reason', reason)
      //     .addField('Invite Link', 'https://discord.gg/tH8pDMh')
      // })

      await guild.unban(user, reason)
    } catch (e) {
      return void message.channel.send({ embed: Embed.error(e.toString(), author) })
    }

    const log = guild.channels.find((c) => c.type === 'text' && (c.name === settings.settings.logs.moderation || c.id === settings.settings.logs.moderation)) as TextChannel

    settings.punishments.push({
      user: user.id,
      moderator: author.id,
      type: Client.Punishment.Type.PARDON,
      reason
    })

    if (log) {
      await log.send({
        embed: Embed.warn(author)
          .setTitle(this.name.replace(/^\w/g, (t: string) => t.toUpperCase()))
          .addField('User', user.tag)
          .addField('Moderator', `<@${author.id}>`)
          .addField('Reason', reason)
      })
    }

    const embed = Embed.warn(author)
      .addField('Moderation', 'Pardon sucessful')
      .addField('Reason', reason)

    await message.channel.send({ embed })
  }
}
