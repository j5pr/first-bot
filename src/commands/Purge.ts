import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Purge extends Command {
  public name: string = 'purge'
  public aliases: string[] = ['prune']
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.MODERATOR

  public description: string = 'Purge messages from chat'
  public usage: string = 'purge <amount (1-99)> [reason]'

  public options = []

  public async run(client: Client, message: Message, args: Args, settings: Client.Guild): Promise<void> {
    if (args._.length !== 1 && args._.length !== 2) {
      return void await this.args(message)
    }

    const { author, guild } = message

    if (!guild.member(client.user).hasPermission('MANAGE_MESSAGES')) {
      return void Embed.error('I must have permission [MANAGE_MESSAGES] to do this!')
    }

    const amount = parseInt(args._[0])

    if (amount === NaN || amount < 1 || amount > 99) {
      return void await this.args(message)
    }

    if (message.channel.type !== 'text') {
      return void await message.channel.send({ embed: Embed.error('We must be in a text channel!', author) })
    }

    const reason = args._.splice(1).join(' ') || 'None'

    try {
      const messages = await message.channel.fetchMessages({ limit: amount + 1 })

      await message.channel.bulkDelete(messages)

      const embed = Embed.warn(author)
        .addField('Moderation', `Purge sucessful (${amount} messages)`)
        .addField('Reason', reason)

      let m = await message.channel.send({ embed: embed }) as Message

      await m.delete(5000)

    } catch (err) {
      await message.channel.send({ embed: Embed.error(`Encountered error during bulk delete:\n${err}`, author) })
    }
  }
}
