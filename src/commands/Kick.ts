import { GuildMember } from 'discord.js'

import { Args, Category, Client, Punishment, Elevation } from '../model'

export default new class Kick extends Punishment {
  public name: string = 'kick'
  public type: Client.Punishment.Type = Client.Punishment.Type.KICK
  public aliases: string[] = []
  public category: Category = Category.MODERATION

  public elevation: Elevation = Elevation.GLOBAL_ADMINISTRATOR | Elevation.MODERATOR

  public description: string = 'Kick a user'
  public usage: string = 'kick <user> [reason]'

  public options = []

  public async punish(user: GuildMember, reason: string, args: Args): Promise<void> {
    await user.kick(reason)
  }

  public verify(client: Client, user: GuildMember): boolean {
    return user.kickable
  }
}