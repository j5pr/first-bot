import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new (class Info extends Command {
  public name = 'info'
  public aliases: string[] = ['information', 'invite']
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description = 'Basic information about the bot'
  public usage = 'info'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args
  ): Promise<void> {
    if (args._.length !== 0) {
      return this.args(message)
    }

    const embed = Embed.info(message.author)
      .addField(
        'ArctBot',
        `Hello, I'm ArctBot! I am a discord bot made by ${
          (await client.fetchUser('470502898758057986')).tag
        } to help make your server better!`
      )
      .addField('Version', client.version)
      .addField(
        'Users',
        `I am helping out ${client.users.size} users in ${client.guilds.size} servers!`
      )
      .addField(
        'Features',
        'I am a multipurpose bot that is actively being maintained, which means I have *many* features!\nI have moderation commands, utility commands, information commands, music commands, and entertainment commands! Each of these categories help complete a task faster or provide more convinience.'
      )
      .addField(
        'How To Use',
        "All of my commands are under the prefix '$' by default. To learn more about what commands I have, use $help. To gain more information on a single command, use $help [command]"
      )
      .addField(
        'Elevation',
        "Some commands require moderator or administrator permissions. To show me who you've picked as moderators and administrators, use the settings commands and update roles.moderator and roles.administrator to their respective roles."
      )
      .addField(
        'Invite Link',
        'If you would like me to join your server, just click on this link!\nhttps://discordapp.com/oauth2/authorize?client_id=508692053966848031&permissions=8&scope=bot'
      )

    await message.channel.send({ embed })
  }
})()
