import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Punishments extends Command {
  public name = 'punishments'
  public aliases: string[] = ['punishes', 'history']
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.MODERATOR

  public description = 'List punishments'
  public usage = 'punishments [user]'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args,
    guild: Client.Guild
  ): Promise<void> {
    if (args._.length > 1) {
      return this.args(message)
    }

    const user = client.userify(args._[0])

    const match =
      args._.length === 1 && user
        ? (id: string): boolean => id === user.id
        : (): boolean => true

    const embed = Embed.info(message.author).addField(
      '**Punishments**',
      `Most recent punishments for ${
        args._.length === 1 && user ? user : message.guild.name
      }.`
    )

    for (const punishment of guild.punishments.slice(-20)) {
      if (match(punishment.user)) {
        embed.addField(
          (await client.fetchUser(punishment.user)).tag,
          `Type: ${punishment.type}\nReason: ${punishment.reason}\nModerator: ${
            (await client.fetchUser(punishment.moderator)).tag
          }`
        )
      }
    }

    await message.channel.send({ embed })
  }
})()
