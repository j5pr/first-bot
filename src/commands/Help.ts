import { Message } from 'discord.js'

import { Args, Category, Client, Command, Elevation, Embed, flag } from '../model'

export default new class Help extends Command {
  public name: string = 'help'
  public aliases: string[] = []
  public category: Category = Category.GENERAL

  public elevation: Elevation = Elevation.GLOBAL_USER | Elevation.USER

  public description: string = 'Get information!'
  public usage: string = 'help [command]'
  
  public options = [{ ...flag, name: 'all', description: 'Display all commands, including ones you can\'t execute', alias: 'a' }]

  public async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void> {
    if (args._.length !== 0 && args._.length !== 1)
      return void await this.args(message)

    if (args._.length === 0) {
      const embed = Embed.info()
        .addField('**Commands**', 'Here are all of the commands available currently!')

      for (const category in Category) {
        const commands = await this.filterAsync(client.commands, async (cmd) =>
          cmd.category.toLowerCase() === category.toLowerCase() &&  
          (args.all || Client.allowed(await client.elevation(message.author, message.guild), cmd.elevation))
        )

        embed.addField(category.toLowerCase().replace(/^\w/g, (t: string) => t.toUpperCase()), commands.length > 0 ? commands.map((cmd) => cmd.name).join(', ') : 'None')
      }

      return void await message.channel.send({ embed })
    }

    const command = client.commands.find((cmd) => cmd.name.toLowerCase() === args._[0])

    if (!command)
      return void message.channel.send({ embed: Embed.error('Could not find command!', message.author) })

    const embed = Embed.info()
      .addField('Name', command.name)
      .addField('Description', command.description)
      .addField('Aliases', command.aliases.join(', ') !== '' ? command.aliases.join(', ') : '*None*')
      .addField('Options', command.options.length > 0 ? command.options.map((option) => `${option.name} ${option.alias ? `(${option.alias}) ` : ''}${option.description ? `: ${option.description}` : ''}`).join('\n'): '*None*')
      .addField('Usage', command.usage)
      .addField('Elevation', command.elevation.toString(16).padStart(2, '0').toUpperCase())

    await message.channel.send({ embed })
  }

  private async filterAsync<T>(array: T[], filter: (element: T) => Promise<boolean>): Promise<T[]> {
    const fail = Symbol()

    return (await Promise.all(array.map(async item => (await filter(item)) ? item : fail))).filter(i => i !== fail) as T[]
  }
}
