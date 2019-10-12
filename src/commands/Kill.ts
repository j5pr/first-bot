import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation } from '../model'

import { kill } from '../config/messages.json'

export default new (class Kill extends Command {
  public name = 'kill'
  public aliases: string[] = ['die', 'murder']
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'Meanie D:'
  public usage = 'kill <user>'

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

    const draw = Math.floor(Math.random() * Math.floor(kill.length))

    await message.channel.send(
      `${kill[draw]} (${draw + 1}/${kill.length})`
        .replace(/\{\{user\}\}/g, target.username)
        .replace(/\{\{author\}\}/g, message.author.username)
    )
  }
})()
