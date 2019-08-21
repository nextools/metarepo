import path from 'path'
import { homedir } from 'os'
import { access, writeFile } from 'pifs'
import execa from 'execa'
import { isString } from 'tsfn'
import makeDir from 'make-dir'

export type TRunEmulator = {
  isHeadless: boolean,
  portsToForward: number[],
}

export const runEmulator = async (options: TRunEmulator): Promise<() => void> => {
  let avdHomePath = null

  if (isString(process.env.ANDROID_AVD_HOME)) {
    avdHomePath = process.env.ANDROID_AVD_HOME
  } else if (isString(process.env.ANDROID_SDK_HOME)) {
    avdHomePath = path.join(process.env.ANDROID_SDK_HOME, 'avd')
  } else {
    avdHomePath = path.join(homedir(), '.android', 'avd')
  }

  const reboxAvdPath = path.join(avdHomePath, 'rebox.avd')
  const configIniPath = path.join(reboxAvdPath, 'config.ini')
  const reboxIniPath = path.join(avdHomePath, 'rebox.ini')

  try {
    await access(reboxAvdPath)
  } catch {
    await makeDir(reboxAvdPath)

    const reboxIniData = [
      'avd.ini.encoding=UTF-8',
      `path=${reboxAvdPath}`,
      'path.rel=avd/rebox.avd',
      'target=android-28',
    ].join('\n')

    await writeFile(reboxIniPath, reboxIniData)

    const configIniData = [
      'PlayStore.enabled=false',
      'abi.type=x86',
      'avd.ini.encoding=UTF-8',
      'hw.accelerometer=yes',
      'hw.audioInput=no',
      'hw.audioOutput=no',
      'hw.battery=yes',
      'hw.cpu.arch=x86',
      'hw.dPad=no',
      'hw.device.manufacturer=Google',
      'hw.device.name=Nexus 5',
      'hw.gps=no',
      'hw.lcd.density=480',
      'hw.lcd.height=1920',
      'hw.lcd.width=1080',
      'hw.mainKeys=no',
      'hw.sdCard=no',
      'hw.sensors.orientation=yes',
      'hw.sensors.proximity=yes',
      'hw.trackBall=no',
      'hw.keyboard=yes',
      'image.sysdir.1=system-images/android-28/google_apis/x86/',
      'tag.display=Google APIs',
      'tag.id=google_apis',
    ].join('\n')

    await writeFile(configIniPath, configIniData)
  }

  const emulatorProcess = execa(
    `${process.env.ANDROID_HOME}/emulator/emulator`,
    [
      '-avd',
      'rebox',
      '-gpu',
      'host',
      // empty string doesn't work
      ...(options.isHeadless ? ['-no-window'] : []),
      '-no-audio',
      '-memory',
      '2048',
      '-partition-size',
      '1024',
      '-netfast',
      '-accel',
      'on',
      '-no-boot-anim',
    ],
    {
      stderr: process.stderr,
    }
  )

  await execa(
    `${process.env.ANDROID_HOME}/platform-tools/adb`,
    [
      'wait-for-device',
      'shell',
      'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;',
    ]
  )

  for (const port of options.portsToForward) {
    await execa(
      `${process.env.ANDROID_HOME}/platform-tools/adb`,
      ['reverse', `tcp:${port}`, `tcp:${port}`]
    )
  }

  return () => {
    emulatorProcess.kill('SIGKILL')
  }
}
