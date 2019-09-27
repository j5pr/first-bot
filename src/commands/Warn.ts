import { GuildMember } from 'discord.js'

import { Args, Client, Punishment } from '../model'

export default new class Warn extends Punishment {
  public name: string = 'warn'
  public type: Client.Punishment.Type = Client.Punishment.Type.WARNING
  public aliases: string[] = []

  public description: string = 'Warn a user'
  public usage: string = 'warn <user> [reason]'

  public options = []

  public async punish(user: GuildMember, reason: string, args: Args): Promise<void> {

  }

  public verify(client: Client, user: GuildMember): boolean {
    return true
  }
}
