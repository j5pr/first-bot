import { Arguments, Options } from 'yargs'

export type Args = Arguments<any>

export const boolean: Options = { type: 'boolean' }
export const number: Options = { type: 'number' }
export const string: Options = { type: 'string' }

export const required: Options = { demandOption: true }
export const flag: Options = { ...boolean, default: false }
