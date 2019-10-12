import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation } from '../model'

export default new (class Sarcastic extends Command {
  public name = 'sarcastic'
  public aliases: string[] = ['sarcasm', 'mock']
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'lOl SaRcAsM!'
  public usage = 'sarcastic <..message>'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length < 1) {
      return this.args(message)
    }

    const reply = await message.channel.send(
      'Here is your sarcastic text! Copy in the next 5 seconds.\n> ' +
        [...args._.join(' ').toLowerCase()]
          .map((v, i) => (i % 2 ? v : v.toUpperCase()))
          .join('')
    )
    await (Array.isArray(reply) ? reply[0] : reply).delete(5000)
    await message.delete(1000)
  }
})()
