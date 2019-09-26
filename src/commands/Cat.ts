import axios from 'axios'
import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Cat extends Command {
  public name: string = 'cat'
  public aliases: string[] = [ 'cat', 'meow' ]
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description: string = 'Space heater!'
  public usage: string = 'cat'
  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 0)
      return void this.args(message)

    let data

    try {
      data = await axios.get('https://some-random-api.ml/img/cat')
    } catch (e) {
      return void message.channel.send(Embed.error(e.toString(), message.author))
    }

    await message.reply('here is your cat image!', {
      file: data.data.link
    })
  }
}