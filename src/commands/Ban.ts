import { GuildMember } from 'discord.js'

import { Args, Client, Punishment, number } from '../model'

export default new class Ban extends Punishment {
  public name: string = 'ban'
  public type: Client.Punishment.Type = Client.Punishment.Type.BAN
  public aliases: string[] = []

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
