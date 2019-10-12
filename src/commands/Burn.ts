import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation } from '../model'

import { burn } from '../config/messages.json'

export default new (class Burn extends Command {
  public name = 'burn'
  public aliases: string[] = ['hot']
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'Space heater!'
  public usage = 'burn <mention>'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 1) {
      return this.args(message)
    }

    const target = client.userify(args._[0])

    if (!target) {
      return
    }

    const draw = Math.floor(Math.random() * Math.floor(burn.length))

    await message.channel.send(
      `${burn[draw]} (${draw + 1}/${burn.length})`
        .replace(/\{\{user\}\}/g, target.username)
        .replace(/\{\{author\}\}/g, message.author.username)
    )
  }
})()
