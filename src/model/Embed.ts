import { RichEmbed, User } from 'discord.js'

import { Command, Elevation } from '.'

export class Embed {
  public static base(user?: User): RichEmbed {
    const embed = new RichEmbed()
      .setFooter('ArctBot', 'https://cdn.discordapp.com/avatars/508692053966848031/893e48c96ac55fe3980a671af388137c.webp?size=128')
      .setTimestamp()

    return user ?
      embed.setAuthor(user.username, user.displayAvatarURL) :
      embed
  }

  public static info(user?: User): RichEmbed {
    return Embed.base(user)
      .setColor(0x149DDF)
  }

  public static warn(user?: User): RichEmbed {
    return Embed.base(user)
      .setColor(0xFFB825)
  }

  public static error(message: string, user?: User): RichEmbed {
    return Embed.base(user)
      .setColor(0xE63B10)
      .addField(':x: **Error!**', message)
  }

  public static log(command: Command, elevation: Elevation, args: string[], author: User, level: 'info' | 'warn' = 'info', user?: User): RichEmbed {
    return (level === 'info' ? this.info(user) : this.warn(user))
      .addField('Log Entry', `Command $${command.name} has been executed by ${author}`)
      .addField('Arguments', args.join(' ') === '' ? 'None' : args.join(' '))
      .addField('Elevation', `Required: ${command.elevation.toString(16).padStart(2, '0').toUpperCase()}\nHas: ${elevation.toString(16).padStart(2, '0').toUpperCase()}`)
  }

  public static args(user?: User): RichEmbed {
    return Embed.error('Invalid Arguments!\n Use $help <command> to find usage for this command.', user)
  }
}
