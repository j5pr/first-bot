import { Message } from 'discord.js'
import * as math from 'mathjs'
import Yargs from 'yargs/yargs'

import { Args, Category, Client, Command, Elevation, Embed, flag } from '../model'

export default new class Math extends Command {
  public name: string = 'math'
  public aliases: string[] = [ 'calc', 'calculator' ]
  public category: Category = Category.UTILITY

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description: string = 'Do quick maths'
  public usage: string = 'math [scope] <expression>'

  public options = [
    { ...flag, name: 'evaluate', description: 'Evaluate an expression', default: true, alias: 'e' },
    { ...flag, name: 'simplify', description: 'Use the simplify() function', alias: 's' },
    { ...flag, name: 'derivative', description: 'Use the derivative() function', alias: 'd' }
  ]

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length < 1)
      return void await this.args(message)

    let scope: { [key: string]: any } = {}

    if (args.length === 2)
      scope = JSON.parse(args.shift() || '{}')

    const expr = args._.join(' ')

    try {
      if (args.evaluate)
        await message.channel.send(`\`\`\`${expr} = ${math.evaluate(expr, scope)}\`\`\``)
      else if (args.simplify)
        await message.channel.send(`\`\`\`simplify(${expr}) = ${math.simplify(expr)}\`\`\``)
      else if (args.derivative)
        await message.channel.send(`\`\`\`derivative(${expr}) = ${math.derivative(expr, scope.v || 'x')}\`\`\``)
      else
        await message.channel.send({ embed: Embed.error('Invalid operation!', message.author) })
    } catch (e) {
      await message.channel.send({ embed: Embed.error(e.toString(), message.author) })
    }
  }
}