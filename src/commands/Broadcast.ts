import { Message } from 'discord.js'

import { Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Broadcast extends Command {
  public name = 'broadcast'
  public aliases: string[] = ['say', 'copy']
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.NONE

  public description = 'Megaphone!'
  public usage = 'broadcast <message>'

  public options = []

  public async run(
    client: Client,
    message: Message
    // args: Args,
    // guild: Client.Guild
  ): Promise<void> {
    await message.channel.send({
      embed: Embed.error(
        'This command has yet to be implemented.',
        message.author
      )
    })
  }
})()
