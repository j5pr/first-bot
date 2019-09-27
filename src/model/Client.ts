import { User, Guild } from 'discord.js'
import * as discord from 'discord.js'
import Enmap from 'enmap'
import { Logger, createLogger, transports, format } from 'winston'

import { Command, Elevation, Event } from '.'

export class Client extends discord.Client {
  public version: string
  public cooldown: number

  public commands: Command[] = []
  public logger: Logger

  public data: Enmap<string, Client.Guild> & { defaults: Client.Guild }
  public music: Map<string, Client.Guild.Music> = new Map()

  private accounts: { owner: string, admin: string[], trusted: string[], blacklisted: string[] }

  public constructor(public options: Client.Options) {
    super(options)

    this.version = options.version || '**N/A**'
    this.cooldown = options.cooldown || 1000

    this.accounts = options.accounts
    this.logger = options.logger || createLogger({ level: 'info', transports: [new transports.Console({ format: format.simple() })] })

    this.token = options.token

    // @ts-ignore (Enmap<string, Client.Guild> not assignable to Enmap<string, Client.Guild> & { defaults: Client.Guild }) - Defaults asigned immediately afterwards
    this.data = new Enmap({
      name: 'guild',
      autoFetch: true,
      fetchAll: true,
      ensureProps: true,
      cloneLevel: 'deep'
    })
    this.data.defaults = options.defaults
  }

  public async elevation(user: User, guild: Guild): Promise<Elevation> {
    const member = guild.member(user)

    let global = Elevation.GLOBAL_USER
    let local = Elevation.USER

    const guildData = this.data.ensure(guild.id, this.data.defaults)
    const settings = guildData.settings

    const adminRole = guild.roles.find((v) => v.name === settings.roles.administrator || v.id === settings.roles.administrator)
    const modRole = guild.roles.find((v) => v.name === settings.roles.moderator || v.id === settings.roles.moderator)
    const blacklistRole = guild.roles.find((v) => v.name === settings.roles.blacklisted || v.id === settings.roles.blacklisted)

    if (this.accounts.owner === user.id) {
      global = Elevation.GLOBAL_AUTHOR
    } else if (this.accounts.admin.includes(user.id)) {
      global = Elevation.GLOBAL_ADMINISTRATOR
    } else if (this.accounts.trusted.includes(user.id)) {
      global = Elevation.GLOBAL_TRUSTED
    } else if (this.accounts.blacklisted.includes(user.id)) {
      global = Elevation.GLOBAL_BLACKLISTED
    }

    if (user.id === guild.owner.id) {
      local = Elevation.OWNER
    } else if (member && adminRole && member.roles.has(adminRole.id)) {
      local = Elevation.ADMINISTRATOR
    } else if (member && modRole && member.roles.has(modRole.id)) {
      local = Elevation.MODERATOR
    } else if (member && blacklistRole && member.roles.has(blacklistRole.id)) {
      local = Elevation.BLACKLISTED
    }

    return global | local
  }

  public async login(): Promise<string> {
    await super.destroy()

    return super.login(this.token)
  }

  public async init(commands: Command[], events: Event[]): Promise<void> {
    for (let event of events) {
      this.logger.info(`Loading Event: ${event.name}`)

      this.on(event.name, event.run.bind(event, this))
    }

    for (let command of commands) {
      this.logger.info(`Loading Command: ${command.name}`)

      this.commands.push(command)
    }

    for (let guild of this.guilds.array()) {
      this.data.ensure(guild.id, this.data.defaults)
    }
  }

  public wait(ms: number): Promise<void> {
    return new Promise((resolve) => this.setTimeout(resolve, ms))
  }

  public mention(mention: string): User | undefined {
    if (!mention.startsWith('<@') || !mention.endsWith('>')) {
      return
    }

    mention = mention.slice(2, -1)

    if (mention.startsWith('!')) {
      mention = mention.slice(1)
    }

    return this.users.get(mention)
  }

  public static allowed(has: Elevation, required: Elevation) {
    return (has & 0xF0) > Elevation.GLOBAL_USER || (has & 0x0F) > Elevation.USER ?
      false :
      !((has & 0xF0) > (required & 0xF0) && (has & 0x0F) > (required & 0x0F))
  }
}

export namespace Client {
  export interface Guild {
    music?: Guild.Music
    punishments: Punishment[]
    settings: Guild.Settings
  }

  export namespace Guild {
    export interface Settings {
      prefix: string
      welcome: {
        enabled: boolean,
        channel: string,
        join: string,
        leave: string
      }
      logs: {
        enabled: boolean
        moderation: string
        standard: string
      }
      roles: {
        moderator: string
        administrator: string
        blacklisted: string
      }
    }

    export interface Music {
      textChannel: discord.TextChannel | discord.DMChannel | discord.GroupDMChannel
      voiceChannel: discord.VoiceChannel
      connection: discord.VoiceConnection
      volume: number
      playing: boolean
      queue: Music.Song[]
    }

    export namespace Music {
      export interface Song {
        title: string
        author: string
        url: string
      }
    }
  }

  export interface Punishment {
    user: string
    moderator: string
    type: Punishment.Type
    reason: string
  }

  export namespace Punishment {
    export enum Type {
      PARDON = 'Pardon',
      WARNING = 'Warning',
      MUTE = 'Mute',
      UNMUTE = 'Unmute',
      KICK = 'Kick',
      BAN = 'Ban'
    }
  }

  export type Options = discord.ClientOptions & {
    accounts: {
      owner: string
      admin: string[]
      trusted: string[]
      blacklisted: string[]
    }
    defaults: Guild
    version?: string
    cooldown?: number
    token: string
    logger?: Logger
  }
}
