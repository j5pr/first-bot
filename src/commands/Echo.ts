import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation } from '../model'

export default new (class Echo extends Command {
  public name = 'echo'
  public aliases: string[] = ['say', 'copy']
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'I can say stuff too!'
  public usage = 'echo <..message>'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length < 1) {
      return this.args(message)
    }

    const reply = args._.join(' ')

    await message.channel.send(reply)

    message.delete(1000)
  }
})()
