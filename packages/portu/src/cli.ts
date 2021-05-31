#!/usr/bin/env node
import { waitForPort } from './wait-for-port'

if (process.argv.length < 3) {
  throw new Error('Usage: portu <port> [host]')
}

const port = Number(process.argv[2])
const host = process.argv[3] ?? '0.0.0.0'

waitForPort(port, host).catch((err) => {
  console.error(err)
  process.exit(1)
})
