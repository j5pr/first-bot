import axios from 'axios'
import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Meme extends Command {
  public name = 'meme'
  public aliases: string[] = []
  public category: Category = Category.ENTERTAINMENT

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'Oh no...'
  public usage = 'meme'

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
      data = await axios.get('https://meme-api.herokuapp.com/gimme')
    } catch (e) {
      await message.channel.send({
        embed: Embed.error(e.toString(), message.author)
      })

      return
    }

    await message.reply(
      `here is your meme!\n\nOriginal Link: ${data.data.postLink}\nSubreddit: ${data.data.subreddit}\nTitle: ${data.data.title}`,
      {
        file: data.data.url
      }
    )
  }
})()
