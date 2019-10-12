import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new (class User extends Command {
  public name = 'user'
  public aliases: string[] = []
  public category: Category = Category.INFORMATION

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description = 'Gain information about a user'
  public usage = 'user [user]'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 0 && args._.length !== 1) {
      return this.args(message)
    }

    const user = message.mentions.users.first() || message.author

    const embed = Embed.info(message.author)
      .setThumbnail(user.avatarURL)
      .addField('Username', user.tag)
      .addField('User ID', user.id)
      .addField('Avatar', user.avatarURL)
      .addField('Join Date', user.createdAt)
      .addField('Status', user.presence.status.toUpperCase())
      .addField(
        'Elevation',
        client
          .elevation(user, message.guild)
          .toString(16)
          .toUpperCase()
      )

    await message.channel.send({ embed })
  }
})()
