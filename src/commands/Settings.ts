import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed } from '../model'

type Value = number | boolean | string | Value[]

export default new (class Settings extends Command {
  public name = 'settings'
  public aliases: string[] = ['preferences', 'set']
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.OWNER

  public description = 'View and modify server-wide preferences'
  public usage = 'settings [setting] [value]'

  public options = []

  public async run(
    client: Client,
    message: Message,
    args: Args,
    guild: Client.Guild
  ): Promise<void> {
    const { author } = message

    if (args._.length === 0 || args._.length === 1) {
      const setting = args._[0]
      let value

      if (!setting) {
        value = guild.settings
      } else {
        value = this.get(guild.settings, setting)
      }

      if (value === undefined) {
        await message.channel.send({
          embed: Embed.error('Could not find setting', author)
        })

        return
      }

      if (typeof value === 'object') {
        value = JSON.stringify(value, null, 2)
      }

      await message.channel.send({
        embed: Embed.info(author).addField(
          `Setting: ${setting || '[root]'}`,
          `\`\`\`${value}\`\`\``
        )
      })

      return
    }

    const setting = args._.shift() as string
    let value = this.get(guild.settings, setting)

    if (
      value !== null &&
      (value === undefined ||
        (typeof value === 'object' && !Array.isArray(value)))
    ) {
      await message.channel.send({
        embed: Embed.error('Setting must be a leaf node', author)
      })

      return
    }

    if (!this.set(guild.settings, setting, this.resolve(args._.join(' ')))) {
      await message.channel.send({
        embed: Embed.error('Could not find setting', author)
      })

      return
    }

    client.data.set(message.guild.id, guild)
    guild = client.data.ensure(message.guild.id, client.data.defaults)

    let newValue = this.get(guild.settings, setting)

    if (newValue === undefined) {
      await message.channel.send({
        embed: Embed.error('Could not find setting', author)
      })

      return
    }

    if (typeof value === 'object') {
      value = JSON.stringify(value, null, 2)
    }

    if (typeof newValue === 'object') {
      newValue = JSON.stringify(newValue, null, 2)
    }

    await message.channel.send({
      embed: Embed.info(author).addField(
        `Setting: ${setting}`,
        `Original Value: \`\`\`${value}\`\`\`New Value: \`\`\`${newValue}\`\`\``
      )
    })
  }

  private get<T>(object: { [key: string]: any }, path: string): T | undefined {
    let location = object

    for (const node of path.split('.')) {
      if (location[node] === undefined) {
        return undefined
      }

      location = location[node]
    }

    return location as T
  }

  private set<T>(
    object: { [key: string]: any },
    path: string,
    value: T
  ): boolean {
    const nodes = path.split('.')

    if (object === undefined) {
      return false
    }

    for (let i = 0; i < nodes.length - 1; i++) {
      if (object[nodes[i]] === undefined) {
        return false
      } else {
        object = object[nodes[i]]
      }
    }

    object[nodes[nodes.length - 1]] = value
    return true
  }

  private resolve(string: string): Value {
    if (/^Array\(\[(([^,]+,)*([^,]+))?]\)$/.test(string)) {
      return JSON.parse(string.slice(6, -1))
    }

    return !isNaN(+string)
      ? +string
      : string === 'true'
      ? true
      : string === 'false'
      ? false
      : string
  }
})()
