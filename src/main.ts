import 'dotenv/config'

import { promises as fs } from 'fs'
import path from 'path'

import moment from 'moment'
import { createLogger, format, transports } from 'winston'

import { Client, Command, Event } from './model'

import accounts from './config/users.json'
import defaults from './config/settings.json'
;(async (): Promise<void> => {
  const timestamp =
    moment()
      .utc()
      .format('YYYY-MM-DDTHH.mm.ss') + 'Z'

  const commands: Command[] = []
  for (const name of await fs.readdir(
    path.join(__dirname, '..', 'dist', 'commands')
  )) {
    commands.push(
      (await import(path.join(__dirname, '..', 'dist', 'commands', name)))
        .default
    )
  }

  const events: Event[] = []
  for (const name of await fs.readdir(
    path.join(__dirname, '..', 'dist', 'events')
  )) {
    events.push(
      (await import(path.join(__dirname, '..', 'dist', 'events', name))).default
    )
  }

  const client = new Client({
    token: process.env.CLIENT_TOKEN as string,
    version: 'v1.0.0',

    logger: createLogger({
      exitOnError: false,
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.File({ filename: `logs/${timestamp}.combined.log` }),
        new transports.Console({
          format: format.combine(format.timestamp(), format.cli())
        })
      ],
      exceptionHandlers: [
        new transports.File({ filename: `logs/${timestamp}.error.log` })
      ]
    }),

    defaults,
    accounts
  })

  await client.init(commands, events)
  await client.autoReconnect().login()
})()
