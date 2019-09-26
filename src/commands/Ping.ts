import { Message } from 'discord.js'
import Yargs from 'yargs/yargs'

import { Args, Category, Client, Command, Elevation } from '../model'

export default new class Ping extends Command {
  public name: string = 'ping'
  public aliases: string[] = []
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description: string = 'Test your connection to the bot and to the Discord API'
  public usage: string = 'ping'

  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 0)
      return void await this.args(message)

    const ping: Message = await message.channel.send("Ping?") as Message

    await ping.edit(`:ping_pong: Pong! :clock4: Latency is ${ping.createdTimestamp - message.createdTimestamp}ms. :desktop: API Latency is ${Math.round(client.ping)}ms.\n`)
  }
}