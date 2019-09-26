import { GuildMember, Message, TextChannel } from 'discord.js'

import { Args, Client, Command, Embed } from '.'

export abstract class Punishment extends Command {
  protected abstract type: Client.Punishment.Type

  public async run(client: Client, message: Message, args: Args, settings: Client.Guild): Promise<void> {
    const { author, guild } = message

    if (args._.length < 1 || message.mentions.users.size < 1)
      return void await this.args(message)

    const user = guild.member(client.mention(args._[0])!)
    const reason = args._.slice(1).join(' ') || 'None'

    if (user.id === author.id)
      return void message.channel.send({ embed: Embed.error(`Cannot ${this.name} yourself!`, author)})

    if (!user.bannable)
      return void message.channel.send(Embed.error(`I am unable to ${this.name} that user!`, author))

    ;(await user.createDM()).send({ embed: Embed.warn(author)
      .addField(this.name.replace(/^\w/g, (t: string) => t.toUpperCase()), 'You have been punished!')
      .addField('Moderator', `<@${author.id}>`)
      .addField('Reason', reason)})

    try {
      await this.punish(user, `${reason}\n\n[${user.id}]`, args)
    } catch (e) {
      return void message.channel.send({ embed: Embed.error(e.toString(), author)})
    }

    settings.punishments.push({
      user: user.id,
      moderator: author.id,
      type: this.type,
      reason
    })

    const embed = Embed.warn(author)
      .setTitle(this.name.replace(/^\w/g, (t: string) => t.toUpperCase()))
      .addField('User', user.user.tag)
      .addField('Moderator', `<@${author.id}>`)
      .addField('Reason', reason)

    const log = guild.channels.find((c) => c.type === 'text' && (c.name === settings.settings.logs.moderation || c.id === settings.settings.logs.moderation)) as TextChannel

    if (log)
      await log.send({ embed})

    await message.channel.send({ embed })
  }

  public abstract verify(client: Client, user: GuildMember): boolean
  public abstract async punish(user: GuildMember, reason: String, args: Args): Promise<void>
}