import { GuildMember } from 'discord.js'

import { Args, Client, Punishment } from '../model'

export default new class Mute extends Punishment {
  public name: string = 'mute'
  public type: Client.Punishment.Type = Client.Punishment.Type.MUTE
  public aliases: string[] = []

  public description: string = 'Mute a user'
  public usage: string = 'mute <user> [reason]'

  public options = []

  public async punish(user: GuildMember, reason: string, args: Args, guild: Client.Guild): Promise<void> {
    const role = user.guild.roles.find((v) => v.name === guild.settings.roles.blacklisted || v.id === guild.settings.roles.blacklisted)

    await user.addRole(role.id, reason)
  }

  public verify(client: Client, user: GuildMember, guild: Client.Guild): boolean {
    const role = user.guild.roles.find((v) => v.name === guild.settings.roles.blacklisted || v.id === guild.settings.roles.blacklisted)

    return role != null && !user.roles.has(role.id)
  }
}
