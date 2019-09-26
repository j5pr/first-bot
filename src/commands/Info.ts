import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Info extends Command {
  public name: string = 'info'
  public aliases: string[] = [ 'information' ]
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description: string = 'Basic information about the bot'
  public usage: string = 'info'
  
  public options = []

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 0)
      return void await this.args(message)

    const embed = Embed.info(message.author)
      .addField('ArctBot', 'Hello, I\'m ArctBot! I am a discord bot made by Arct#0155 to help make your server better!')
      .addField('Version', client.version)
      .addField('Users', `I am helping out ${client.users.size} users in ${client.guilds.size} servers!`)
      .addField('Features', 'I am a multipurpose bot that is actively being maintained, which means I have *many* features!\nI have moderation commands, utility commands, information commands, music commands, and entertainment commands! Each of these categories help complete a task faster or provide more convinience.')
      .addField('How To Use', 'Every category of command I have has a separate prefix. To learn more about what commands I have an their categories, use !help. To gain more information on a single command, use !help [command]')
      .addField('Elevation', 'Some commands require moderator or administrator permissions. To show me who you\'ve picked as moderators and administrators, create the role "ab:mod" and "ab:admin" and assign them accordingly.')
      .addField('Invite Link', 'If you would like me to join your server, just click on this link!\nhttps://discordapp.com/oauth2/authorize?client_id=508692053966848031&permissions=8&scope=bot')

    await message.channel.send({ embed })
  }
}