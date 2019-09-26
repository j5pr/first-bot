import { Message, User } from 'discord.js'
import Yargs from 'yargs/yargs'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

export default new class Settings extends Command {
  public name: string = 'settings'
  public aliases: string[] = [ 'preferences', 'set' ]
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.OWNER

  public description: string = 'View and modify server-wide preferences'
  public usage: string = 'settings [setting] [value]'

  public options = []
  
  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    const { author } = message

    if (args._.length === 0 || args._.length === 1) {
      const setting = args._[0] ? args._[0].toLowerCase() : undefined
      let value

      if (!setting)
        value = guild.settings
      else
        value = this.get<string>(guild.settings, setting)

      if (!value)
        return void await message.channel.send({ embed: Embed.error('Could not find setting', author) })

      if (typeof value === 'object')
        value = JSON.stringify(value, null, 2)

      return void await message.channel.send({ embed: Embed.info(author).addField(`Setting: ${setting || '[root]'}`, `\`\`\`${value}\`\`\``) })
    }

    const setting = (args._.shift() as string).toLowerCase()
    const value = this.get<string>(guild.settings, setting)

    if (!value || typeof value === 'object')
      return void await message.channel.send({ embed: Embed.error('Setting must be a leaf node', author) })

    if (this.set(guild.settings, setting, args._.join(' ')))
      return void await message.channel.send({ embed: Embed.error('Could not find setting', author) })

    client.settings.set(message.guild.id, guild)

    let newValue = this.get<string>(guild.settings, setting)

    if (!newValue)
      return void await message.channel.send({ embed: Embed.error('Could not find setting', author) })

    if (typeof newValue === 'object')
      newValue = JSON.stringify(value, null, '2')

    await message.channel.send({ embed: Embed.info(author).addField(`Setting: ${setting}`, `Original Value: \`\`\`${value}\`\`\`New Value: \`\`\`${newValue}\`\`\``) })
  }

  private get<T> (object: { [key: string ]: any }, path: string): T | undefined {
    let location = object

    for (let node of path.split('.')) {
      if (location[node] === undefined)
        return undefined

      location = location[node]
    }

    return location as T
  }

  private set<T>(object: { [key: string ]: any }, path: string, value: any): void | true {
    let nodes = path.split('.')

    if (object === undefined)
      return

    for (let i = 0; i < nodes.length - 1; i++)
      if (object[nodes[i]] === undefined)
        return true
      else
        object = object[nodes[i]]

    object[nodes[nodes.length - 1]] = value
  }
}