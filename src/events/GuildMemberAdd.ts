import { GuildMember, TextChannel } from 'discord.js'

import { Client, Event } from '../model'

export default new (class GuildMemberAdd extends Event {
  public name = 'guildMemberAdd'

  public async run(client: Client, member: GuildMember): Promise<void> {
    const guild = client.data.get(member.guild.id)

    if (!guild || guild.settings.welcome.enabled === false) {
      return
    }

    const channel = member.guild.channels.find(
      c =>
        c.type === 'text' &&
        (c.name === guild.settings.welcome.channel ||
          c.id === guild.settings.welcome.channel)
    ) as TextChannel

    if (!channel) {
      return
    }

    channel.send(
      guild.settings.welcome.join
        .replace(/\{\{user\}\}/g, `<@${member.user.id}>`)
        .replace(/\{\{server\}\}/g, member.guild.name)
    )
  }
})()
