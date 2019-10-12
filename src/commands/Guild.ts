import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Guild extends Command {
  public name = 'guild'
  public aliases: string[] = ['server']
  public category: Category = Category.INFORMATION

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description = 'Gain information about the current guild'
  public usage = 'guild'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 0) {
      return this.args(message)
    }

    const { guild } = message

    const categories = guild.channels.filter(c => c.type === 'category').size
    const textChannels = guild.channels.filter(c => c.type === 'text').size
    const voiceChannels = guild.channels.filter(c => c.type === 'voice').size

    const embed = Embed.info(message.author)
      .setThumbnail(guild.iconURL)
      .addField('Icon', guild.iconURL)
      .addField(
        'Statistics',
        `Categories: ${categories}\nChannels: ${guild.channels.size -
          categories} (${textChannels} text, ${voiceChannels} voice)\nRoles: ${
          guild.roles.size
        }\nEmojis: ${guild.emojis.size}`
      )
      .addField('Members', guild.memberCount)
      .addField('Bans', (await guild.fetchBans()).size)
      .addField('Owner', guild.owner.user.tag)
      .addField(
        'Creation Date',
        `${guild.createdAt}\n${guild.createdAt.toISOString()}`
      )
      .addField('Region', guild.region.toUpperCase())

    await message.channel.send({ embed })
  }
})()
