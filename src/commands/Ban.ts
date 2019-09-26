import { GuildMember } from 'discord.js'
import Yargs from 'yargs/yargs'

import { Args, Category, Client, Punishment, Elevation, Embed, number } from '../model'

export default new class Ban extends Punishment {
  public name: string = 'ban'
  public type: Client.Punishment.Type = Client.Punishment.Type.BAN
  public aliases: string[] = []
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.ADMINISTRATOR

  public description: string = 'Ban a user'
  public usage: string = 'ban <user> [reason]'
  
  public options = [{ ...number, name: 'days', description: 'Number of days of messages to delete', alias: 'd', default: 0 }]

  public async punish(user: GuildMember, reason: string, args: Args): Promise<void> {
    await user.ban({ reason, days: args.days })
  }

  public verify(client: Client, user: GuildMember): boolean {
    return user.bannable
  }
}