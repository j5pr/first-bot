import { GuildMember } from 'discord.js'
import Yargs from 'yargs/yargs'

import { Args, Category, Client, Punishment, Elevation, Embed } from '../model'

export default new class Warn extends Punishment {
  public category: Category = Category.MODERATION
  public name: string = 'warn'
  public type: Client.Punishment.Type = Client.Punishment.Type.WARNING
  public aliases: string[] = []

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.MODERATOR

  public description: string = 'Warn a user'
  public usage: string = 'warn <user> [reason]'

  public options = []

  public async punish(user: GuildMember, reason: string, args: Args): Promise<void> {

  }

  public verify(client: Client, user: GuildMember): boolean {
    return true
  }
}