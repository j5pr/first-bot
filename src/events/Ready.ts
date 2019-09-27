import { Client as DiscordClient } from 'discord.js'

import { Client, Event } from '../model'

export default new class Ready extends Event {
  public name: string = 'ready'

  public async run(client: Client): Promise<void> {
    await client.wait(1000)

    await this.setPresence(client)

    client.logger.info(`Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`)

    setInterval(() => this.setPresence(client), 5 * 60 * 1000)
  }

  public async setPresence(client: DiscordClient) {
    await client.user.setPresence({
      game: {
        type: 'WATCHING',
        name: `for $info in ${client.guilds.size} guilds`
      }
    })
  }
}
