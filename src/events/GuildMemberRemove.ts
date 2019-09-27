import { GuildMember, TextChannel } from 'discord.js'

import { Client, Event } from '../model'

export default new class GuildMemberRemove extends Event {
  public name: string = 'guildMemberRemove'

  public async run(client: Client, member: GuildMember): Promise<void> {
    const guild = client.data.get(member.guild.id)

    if (!guild || guild.settings.welcome.enabled === false) {
      return
    }

    const channel = member.guild.channels.find((c) => c.type === 'text' && (c.name === guild.settings.welcome.channel || c.id === guild.settings.welcome.channel)) as TextChannel

    if (!channel) {
      return
    }

    channel.send(guild.settings.welcome.leave.replace(/\{\{user\}\}/g, member.user.tag).replace(/\{\{server\}\}/g, member.guild.name))
  }
}
