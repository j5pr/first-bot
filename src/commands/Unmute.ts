import { GuildMember } from 'discord.js'

import { Args, Client, Punishment } from '../model'

export default new class Unmute extends Punishment {
  public name: string = 'unmute'
  public type: Client.Punishment.Type = Client.Punishment.Type.UNMUTE
  public aliases: string[] = ['pardonmute']

  public description: string = 'Unmute a user'
  public usage: string = 'unmute <user> [reason]'

  public options = []

  public async punish(user: GuildMember, reason: string, args: Args, guild: Client.Guild): Promise<void> {
    const role = user.guild.roles.find((v) => v.name === guild.settings.roles.blacklisted || v.id === guild.settings.roles.blacklisted)

    await user.removeRole(role.id, reason)
  }

  public verify(client: Client, user: GuildMember, guild: Client.Guild): boolean {
    const role = user.guild.roles.find((v) => v.name === guild.settings.roles.blacklisted || v.id === guild.settings.roles.blacklisted)

    return role != null && user.roles.has(role.id)
  }
}
