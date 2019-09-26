import axios from 'axios'
import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'
import Yargs from 'yargs/yargs'

export default new class Meme extends Command {
  public name: string = 'meme'
  public aliases: string[] = []
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description: string = 'Oh no...'
  public usage: string = 'meme'

  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 0)
      return void this.args(message)

    let data;

    try {
      data = await axios.get('https://meme-api.herokuapp.com/gimme')
    } catch (e) {
      return void message.channel.send(Embed.error(e.toString(), message.author))
    }

    await message.reply(`here is your meme!\n\nOriginal Link: ${data.data.postLink}\nSubreddit: ${data.data.subreddit}\nTitle: ${data.data.title}`, {
      file: data.data.url
    })
  }
}