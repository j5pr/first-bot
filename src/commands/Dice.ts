import * as d from 'dice-typescript'
import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Dice extends Command {
  public name: string = 'dice'
  public aliases: string[] = [ 'calc', 'calculator' ]
  public category: Category = Category.UTILITY

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description: string = 'Do quick maths'
  public usage: string = 'math <expression>'

  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length < 1)
      return void await this.args(message)

    const expression = args._.join(' ')

    let roll

    try {
      roll = new d.Dice().roll(expression)
    } catch (e) {
      return void await message.channel.send({ embed: Embed.error(e.toString(), message.author) })
    }

    await message.channel.send({ embed: Embed.info().addField('Dice Roll', expression).addField('Result', roll.total) })
  }
}