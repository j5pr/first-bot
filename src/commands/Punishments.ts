import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Punishments extends Command {
  public name: string = 'punishments'
  public aliases: string[] = [ 'punishes', 'history' ]
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.MODERATOR

  public description: string = 'List punishments'
  public usage: string = 'punishments [user]'

  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length > 1) {
      return void await this.args(message)
    }

    const match = args._.length === 1 && client.userify(args._[0]) ? (id: string) => id === client.userify(args._[0])!.id : () => true

    const embed = Embed.info(message.author)
      .addField('**Punishments**', `Most recent punishments for ${args._.length === 1 && client.userify(args._[0]) ? client.userify(args._[0]) : message.guild.name}.`)

    for (let punishment of guild.punishments.slice(-20)) {
      if (match(punishment.user)) {
        embed.addField((await client.fetchUser(punishment.user)).tag, `Type: ${punishment.type}\nReason: ${punishment.reason}\nModerator: ${(await client.fetchUser(punishment.moderator)).tag}`)
      }
    }

    await message.channel.send({ embed })
  }
}
