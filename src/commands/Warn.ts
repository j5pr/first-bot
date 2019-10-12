import { Client, Punishment } from '../model'

export default new (class Warn extends Punishment {
  public name = 'warn'
  public type: Client.Punishment.Type = Client.Punishment.Type.WARNING
  public aliases: string[] = []

  public description = 'Warn a user'
  public usage = 'warn <user> [reason]'

  public options = []

  public async punish(): Promise<void> {}

  public verify(): boolean {
    return true
  }
})()
