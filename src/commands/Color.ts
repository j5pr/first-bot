import { Message } from 'discord.js'
import tinycolor from 'tinycolor2'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Help extends Command {
  public name: string = 'color'
  public aliases: string[] = []
  public category: Category = Category.UTILITY

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description: string = 'Who doesn\'t like rainbows!'
  public usage: string = 'color <color resolvable>'

  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length < 1) {
      return void await this.args(message)
    }

    let color = tinycolor(args._.join(' '))

    const embed = Embed.base(message.author)
      .setColor(parseInt(color.toHex(), 16))
      .addField('**Color**', color.isValid() ? (color.toName() ? color.toName() : '*No Name*') : '*Invalid Color*')
      .addField('Hex', color.toHexString().toUpperCase() + '\n' + color.toHex8String().toUpperCase())
      .addField('RGB(A)', color.toRgbString() + '\n' + color.toPercentageRgbString())
      .addField('CMYK', `cmyk(${this.numericalToCmyk(parseInt(color.toHex(), 16)).map((v) => v.toPrecision(3)).join(', ')})`)
      .addField('HSL(A)', color.toHslString())
      .addField('HSV(A)', color.toHsvString())

    await message.channel.send({ embed })
  }

  private numericalToRgb(numerical: number): number[] {
    const r = (numerical & 0xff0000) >> 16
    const g = (numerical & 0x00ff00) >> 8
    const b = (numerical & 0x0000ff)

    return [r, g, b]
  }

  private numericalToCmyk(numerical: number): number[] {
    let c = 0, y = 0, m = 0, k = 0

    const [r, g, b] = this.numericalToRgb(numerical)

    if (r === 0 && g === 0 && b === 0) {
      k = 1

      return [c, y, m, k]
    }

    c = 1 - (r / 255)
    m = 1 - (g / 255)
    y = 1 - (b / 255)

    let min = Math.min(c, m, y)

    c = (c - min) / (1 - min)
    m = (m - min) / (1 - min)
    y = (y - min) / (1 - min)
    k = min

    return [c, m, y, k]
  }
}
