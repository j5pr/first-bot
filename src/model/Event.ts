import { Client } from './Client'

export abstract class Event {
  public abstract name: string

  public abstract async run(client: Client, ...args: any): Promise<void>
}