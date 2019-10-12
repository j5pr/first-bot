import axios from 'axios'
import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Cat extends Command {
  public name = 'cat'
  public aliases: string[] = ['cat', 'meow']
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'Meeeeoowww!'
  public usage = 'cat'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 0) {
      return this.args(message)
    }

    let data

    try {
      data = await axios.get('https://some-random-api.ml/img/cat')
    } catch (e) {
      await message.channel.send(Embed.error(e.toString(), message.author))

      return
    }

    await message.reply('here is your cat image!', {
      file: data.data.link
    })
  }
})()
