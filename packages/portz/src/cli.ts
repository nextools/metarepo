#!/usr/bin/env node
import { spawn } from 'child_process'
import { program } from 'commander'
import { version } from '../package.json'
import { registerService } from './register-service'
import { startServer } from './start-server'
import { unregisterService } from './unregister-service'

type TSignalMap = {
  [k in NodeJS.Signals]?: number
}

const signals: TSignalMap = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15,
}

program.version(version)

program
  .command('register')
  .description('register service through portz server')
  .requiredOption('-n, --name [name]', 'service name')
  .option('-d, --deps <name...>', 'dependency name')
  .action(async ({ name, deps }) => {
    const result = await registerService({ name, deps })
    const dashDashArgIndex = program.args.findIndex((arg) => arg === '--')

    if (dashDashArgIndex === -1) {
      throw new Error('Arguments to spawn a process are required')
    }

    const spawnCommand = program.args[dashDashArgIndex + 1]
    const spawnArgs = program.args.slice(dashDashArgIndex + 2)

    const depsEnv: { [k: string]: string } = {}

    if (result.deps != null) {
      for (const [name, port] of Object.entries(result.deps)) {
        depsEnv[`PORT_${name.toUpperCase()}`] = String(port)
      }
    }

    const childProcess = spawn(spawnCommand, spawnArgs, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...depsEnv,
        PORT: String(result.port),
      },
    })

    childProcess.on('error', async (err) => {
      console.error(err)
      await unregisterService(name)
      process.exit(1)
    })

    const kill = async (signal: NodeJS.Signals) => {
      await unregisterService(name)
      console.log('\nbye')
      // https://github.com/npm/cli/issues/1591
      // https://nodejs.org/api/process.html#process_exit_codes
      process.exit(128 + signals[signal]!)
    }

    process.on('SIGTERM', kill)
    process.on('SIGINT', kill)
    process.on('SIGHUP', kill)
  })

program
  .command('unregister')
  .description('unregister service through portz server')
  .requiredOption('-n, --name [name]', 'service name')
  .action(({ name }) => unregisterService(name))

program
  .command('start')
  .description('start portz server')
  .requiredOption('-r, --range <from:to>', 'port range, separated by :', (value) => value.split(':'))
  .action(async ({ range }) => {
    const stopServer = await startServer({
      fromPort: range[0],
      toPort: range[1],
    })

    const kill = async (signal: NodeJS.Signals) => {
      await stopServer()
      console.log('\nbye')
      // https://github.com/npm/cli/issues/1591
      // https://nodejs.org/api/process.html#process_exit_codes
      process.exit(128 + signals[signal]!)
    }

    process.on('SIGTERM', kill)
    process.on('SIGINT', kill)
    process.on('SIGHUP', kill)

    console.log('portz server is up and ready')
  })

program
  .parseAsync(process.argv)
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
