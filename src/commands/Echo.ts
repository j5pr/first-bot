import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, flag } from '../model'

export default new class Echo extends Command {
  public name: string = 'echo'
  public aliases: string[] = [ 'say', 'copy' ]
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description: string = 'I can say stuff too!'
  public usage: string = 'echo <..message>'
  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length < 1)
      return void await this.args(message)

    const reply = args._.join(' ')

    await message.channel.send(reply)

    message.delete(1000)
  }
}