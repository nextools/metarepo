import { runIosApp } from '@rebox/ios'
import { rsolve } from 'rsolve'
import { prepareFiles } from './prepare-files'

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
}
