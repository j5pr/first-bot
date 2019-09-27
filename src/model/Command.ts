import { Message } from 'discord.js'
import { Argv, Options } from 'yargs'
import Yargs from 'yargs/yargs'

import { Args, Category, Client, Elevation, Embed } from '.'

export abstract class Command {
  public abstract name: string
  public abstract aliases: string[]
  public abstract category: Category

  public abstract elevation: Elevation

  public abstract description: string
  public abstract options: ({ name: string } & Options)[]
  public abstract usage: string

  private yurgs: Argv = Yargs()
  private registered: boolean = false

  public abstract async run(client: Client, message: Message, args: Args, guild: Client.Guild): Promise<void>

  public args(message: Message): Promise<any> {
    return message.channel.send({
      embed: Embed.args(message.author)
    })
  }

  public get yargs(): Argv {
    if (!this.registered) {
      for (let option of this.options) {
        this.yurgs.option(option.name, option)
      }

      this.registered = true
    }

    return this.yurgs
  }
}
