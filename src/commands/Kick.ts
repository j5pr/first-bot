import { GuildMember } from 'discord.js'

import { Client, Punishment } from '../model'

export default new (class Kick extends Punishment {
  public name = 'kick'
  public type: Client.Punishment.Type = Client.Punishment.Type.KICK
  public aliases: string[] = ['leave']

  public description = 'Kick a user'
  public usage = 'kick <user> [reason]'

  public options = []

  public async punish(user: GuildMember, reason: string): Promise<void> {
    await user.kick(reason)
  }

  public verify(client: Client, user: GuildMember): boolean {
    return user.kickable
  }
})()
