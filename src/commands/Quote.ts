import { Message, TextChannel } from 'discord.js'
import moment from 'moment'

import { Args, Category, Client, Command, Elevation, flag } from '../model'

export default new (class Quote extends Command {
  public name = 'quote'
  public aliases: string[] = []
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_TRUSTED | Elevation.USER

  public description = 'Quote someone'
  public usage = 'quote <message-id>'

  public options = [
    {
      ...flag,
      name: 'pasteable',
      description:
        'Generate a pasteable quote instead of sending it in the chat',
      alias: 'p'
    }
  ]

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 1) {
      return this.args(message)
    }

    let quote: Message | undefined | void
    for (const channel of message.guild.channels.array()) {
      if (channel.type !== 'text') {
        continue
      }

      try {
        quote = await (channel as TextChannel).fetchMessage(args._[0])

        break
      } catch (e) {}
    }

    if (!quote) {
      await message.channel.send(
        `Could not find message with ID [${args._[0]}]`
      )

      return
    }

    const { author, createdAt, edits, content } = quote

    const output = `>>> _**${author.tag}** ${moment(createdAt).calendar()}${
      edits.length > 1 ? ` (Edited)` : ''
    }_ :\n${content}`

    if (args.pasteable) {
      const reply = await message.channel.send(
        `Here's your quote! Copy in the next 5 seconds\`\`\`${output.replace(
          /`/g,
          `\`${String.fromCharCode(0x200b)}`
        )}\`\`\``
      )
      await (Array.isArray(reply) ? reply[0] : reply).delete(5000)
      await message.delete(1000)

      return
    }

    await message.delete(1000)
    await message.channel.send(output)
  }
})()
