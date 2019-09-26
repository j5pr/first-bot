import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

const { kill } = require('../../assets/messages.json')

export default new class Kill extends Command {
  public name: string = 'kill'
  public aliases: string[] = [ 'die', 'murder' ]
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description: string = 'Meanie D:'
  public usage: string = 'kill <user>'
  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 1)
      return void this.args(message)

    const target = client.mention(args._[0])

    if (!target)
      return

    const draw = Math.floor(Math.random() * Math.floor(kill.length))

    await message.channel.send(`${kill[draw]} (${draw + 1}/${kill.length})`.replace(/\{\{user\}\}/g, target.username).replace(/\{\{author\}\}/g, message.author.username))
  }
}