# @rebox/android ![npm](https://flat.badgen.net/npm/v/@rebox/android)

Set of helpers to deal with React Native applications on Android.

## Install

```sh
$ yarn add @rebox/android
```

## Setup

### macOS

```sh
brew update
brew tap homebrew/cask-versions
brew cask install adoptopenjdk8
brew cask install android-sdk
brew cask install intel-haxm
```

```sh
export ANDROID_HOME=$(brew --prefix)/share/android-sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

```sh
exec $SHELL -l
```

```sh
mkdir $HOME/.android/
touch $HOME/.android/repositories.cfg
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-29" "build-tools;29.0.2" "emulator" "extras;android;m2repository" "system-images;android-29;google_apis;x86"
```

## API

```ts
type TLinkAndroidDependencyOptions = {
  projectPath: string,
  dependencyName: string
}

const linkAndroidDependency: (options: TLinkAndroidDependencyOptions) => Promise<void>
```

```ts
type TBuildAndroidAppDebugOptions = {
  projectPath: string,
  appName: string,
  appId: string
}

const buildAndroidAppDebug: (options: TBuildAndroidAppDebugOptions) => Promise<void>
```

```ts
type TInstallAndroidAppOptions = {
  appPath: string,
  deviceId?: string
}

const installAndroidApp: (options: TInstallAndroidAppOptions) => Promise<void>
```

```ts
type TUninstallAndroidAppOptions = {
  appId: string,
  deviceId?: string // booted one by default
}

const uninstallAndroidApp: (options: TUninstallAndroidAppOptions) => Promise<void>
```

```ts
type TRunAndroidEmulatorOptions = {
  portsToForward: number[],
  isHeadless?: boolean // false by default
}

const runAndroidEmulator: (options: TRunAndroidEmulatorOptions) => Promise<() => void>
```

```ts
type TLaunchAndroidAppOptions = {
  appId: string,
  deviceId?: string // booted one by default
}

const launchAndroidApp: (options: TLaunchAndroidAppOptions) => Promise<void>
```

```ts
type TRunAndroidAppOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  portsToForward?: number[], // additional ports to forward from host to emulator's VM
  fontsDir?: string, // directory with `.ttf` or `.otf` files
  dependencyNames?: string[], // installed NPM package names
  isHeadless?: boolean, // false by default
  logMessage?: (msg: string) => void
}

const runAndroidApp: (options: TRunAndroidAppOptions) => Promise<() => void
```

## Usage

```ts
// App.tsx
import { FC } from 'react'
import { Svg, Circle } from 'react-native-svg'

export const App: FC<{}> = () => (
  <Svg height={100} width={100} viewBox="0 0 100 100">
    <Circle
      cx="50"
      cy="50"
      r="45"
      stroke="blue"
      strokeWidth="2.5"
      fill="green"
    />
  </Svg>
)
```

```ts
// run.ts
import { runAndroidApp } from '@rebox/android'

await runAndroidApp({
  appName: 'Test',
  appId: 'org.nextools.test',
  entryPointPath: './App.tsx',
  dependencyNames: ['react-native-svg'],
  logMessage: console.log
})
```
