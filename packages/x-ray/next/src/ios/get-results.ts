import http from 'http'
import path from 'path'
import { runIosApp } from '@rebox/ios'
import { rsolve } from 'rsolve'
import { unchunkJson } from 'unchunk'
import { prepareFiles } from './prepare-files'

const SERVER_HOST = 'localhost'
const SERVER_PORT = 3003

export const getResults = async (files: string[], fontsDir?: string) => {
  const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')

  await prepareFiles(entryPointPath, files)

  const killAll = await runIosApp({
    appName: 'X-Ray',
    appId: 'org.nextools.x-ray',
    iPhoneVersion: 8,
    iOSVersion: '13.2',
    entryPointPath,
    fontsDir,
    dependencyNames: [
      'react-native-svg',
      'react-native-view-shot',
    ],
    isHeadless: false,
    logMessage: console.log,
  })

  const server = http.createServer(async (req, res) => {
    if (req.url === '/upload') {
      const body = await unchunkJson(req)

      console.log(path.basename(body.path), body.id)
    }

    res.end()
  })

  server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log('SERVER')
  })
}
