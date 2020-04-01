import { run as runIos } from '@rebox/ios'
import { rsolve } from 'rsolve'
import { prepareFiles } from './prepare-files'

export const getResults = async (files: string[], fontsDir?: string) => {
  const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')

  await prepareFiles(entryPointPath, files)

  const killAll = await runIos({
    appName: 'X-Ray',
    appId: 'org.nextools.x-ray',
    iOSVersion: '12.2',
    entryPointPath,
    fontsDir,
    dependencyNames: [
      'react-native-svg',
      'react-native-view-shot',
    ],
    isHeadless: false,
    logMessage: console.log,
  })
}
