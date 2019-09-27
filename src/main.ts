import 'dotenv/config'

import { promises as fs } from 'fs'
import path from 'path'

import moment from 'moment'
import { createLogger, format, transports } from 'winston'

import { Client, Command, Event } from './model'

;(async () => {

  const commands: Command[] = []
  for (let name of await fs.readdir(path.join(__dirname, '..', 'dist', 'commands'))) {
    commands.push((await import(path.join(__dirname, '..', 'dist', 'commands', name))).default)
  }

  const events: Event[] = []
  for (let name of await fs.readdir(path.join(__dirname, '..', 'dist', 'events'))) {
    events.push((await import(path.join(__dirname, '..', 'dist', 'events', name))).default)
  }

  const client = new Client({
    token: process.env.CLIENT_TOKEN as string,
    version: 'v1.0.0',

    logger: createLogger({
      level: 'info',
      format: format.json(),
      transports: [
        new transports.File({ filename: `logs/${moment().utc().format('YYYY-MM-DDTHH.mm.ss')}Z.log` }),
        new transports.Console({ format: format.cli() })
      ]
    }),

    accounts: {
      owner: '470502898758057986',
      admin: [
        '270286112667205635'
      ],
      trusted: [

      ],
       blacklisted: [

      ]
    },

    defaults: {
      settings: {
        prefix: '$',
        welcome: {
          enabled: true,
          channel: 'welcome',
          join: 'Welcome {{user}} to {{server}}',
          leave: '{{user}} has left the server. Goodbye!'
        },
        logs: {
          enabled: true,
          moderation: 'moderation-logs',
          standard: 'logs'
        },
        roles: {
          moderator: 'Moderator',
          administrator: 'Administrator',
          blacklisted: 'Blacklisted'
        }
      },

      punishments: []
    }
  })

  await client.init(commands, events)
  await client.login()

})()
