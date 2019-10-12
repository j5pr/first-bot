import { Message } from 'discord.js'

import { Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Ping extends Command {
  public name = 'test'
  public aliases: string[] = ['tst']
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.NONE

  public description = 'Test some items!'
  public usage = 'test'

  public options = []

  public async run(client: Client, message: Message): Promise<void> {
    const { author } = message

    await message.channel.send('Testing Embeds...')

    await message.channel.send({
      embed: Embed.info(author).addField('f', 'g')
    })
    await message.channel.send({
      embed: Embed.warn(author).addField('h', 'i')
    })
    await message.channel.send({ embed: Embed.error('oh noes!', author) })
  }
})()
