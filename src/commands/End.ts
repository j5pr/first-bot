import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class End extends Command {
  public name: string = 'end'
  public aliases: string[] = [ 'stop' ]
  public category: Category = Category.BOT

  public elevation: Elevation = Elevation.GLOBAL_AUTHOR | Elevation.NONE

  public description: string = 'Gain information about a user'
  public usage: string = 'end <code> [reason]'
  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 1 && args._.length !== 2)
      return void this.args(message)

    const code = parseInt(args._.shift() || '0')

    if (code === NaN)
      return void this.args(message)

    const reason = args._.length > 0 ? args.join(' ') : 'None'

    const embed = Embed.warn(message.author)
      .addField('Exit Code', code)
      .addField('Reason', `*${reason}*`)

    await message.channel.send({ embed })

    console.log(`Ending process... Reason: ${reason}`)

    process.exit(code)
  }
}