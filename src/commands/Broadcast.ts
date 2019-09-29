import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, flag, Embed } from '../model'

export default new class Broadcast extends Command {
  public name: string = 'broadcast'
  public aliases: string[] = ['say', 'copy']
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.NONE

  public description: string = 'Megaphone!'
  public usage: string = 'broadcast <message>'

  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    return void message.channel.send({ embed: Embed.error("This command has yet to be implemented.", message.author) })
  }
}
