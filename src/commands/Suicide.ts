import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation } from '../model/'

import { suicide } from '../config/messages.json'

export default new (class Suicide extends Command {
  public name = 'suicide'
  public aliases: string[] = ['kms']
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'Well yes but actually no'
  public usage = 'suicide'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 0) {
      return this.args(message)
    }

    const draw = Math.floor(Math.random() * Math.floor(suicide.length))

    await message.channel.send(
      `${suicide[draw]} (${draw + 1}/${suicide.length})`.replace(
        /\{\{user\}\}/g,
        message.author.username
      )
    )
  }
})()
