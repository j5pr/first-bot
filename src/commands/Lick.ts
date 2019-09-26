import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

const { lick } = require('../../assets/messages.json')

export default new class Lick extends Command {
  public name: string = 'lick'
  public aliases: string[] = []
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description: string = 'Meanie D:'
  public usage: string = 'lick <user>'
  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 1)
      return void this.args(message)

    const target = client.mention(args._[0])

    if (!target)
      return

    const draw = Math.floor(Math.random() * Math.floor(lick.length))

    await message.channel.send(`${lick[draw]} (${draw + 1}/${lick.length})`.replace(/\{\{user\}\}/g, target.username).replace(/\{\{author\}\}/g, message.author.username))
  }
}