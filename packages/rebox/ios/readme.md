# @rebox/ios ![npm](https://flat.badgen.net/npm/v/@rebox/ios)

Set of helpers to deal with React Native applications on iOS.

## Install

```sh
$ yarn add @rebox/ios
```

## Requirements

* Xcode
* iOS Simulator

## Setup

```sh
brew install cocoapods
```

## API

```ts
type TLinkIosDependencyOptions = {
  projectPath: string,
  dependencyName: string
}

const linkIosDependency: (options: TLinkIosDependencyOptions) => Promise<void>
```

```ts
type TBuildIosAppDebugOptions = {
  projectPath: string,
  iOSVersion: string,
  platformName: string,
  appName: string,
  appId: string
}

const buildIosAppDebug: (options: TBuildIosAppDebugOptions) => Promise<void>
```

```ts
type TInstallIosAppOptions = {
  appPath: string,
  deviceId?: string // booted one by default
}

const installIosApp: (options: TInstallIosAppOptions) => Promise<void>
```

```ts
type TUninstallIosAppOptions = {
  appId: string,
  deviceId?: string // booted one by default
}

const uninstallIosApp: (options: TUninstallIosAppOptions) => Promise<void>
```

```ts
type TRunSimulatorOptions = {
  iPhoneVersion: number,
  iOSVersion: string,
  isHeadless?: boolean // false by default
}

const runIosSimulator: (options: TRunSimulatorOptions) => Promise<() => void>
```

```ts
type TLaunchIosAppOptions = {
  appId: string,
  deviceId?: string // booted one by default
}

const launchIosApp: (options: TLaunchIosAppOptions) => Promise<void>
```

```ts
type TRunIosOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  iOSVersion: string, // for example `13.2`
  iPhoneVersion: number, // for example `8`
  fontsDir?: string, // directory with `.ttf` or `.otf` files
  dependencyNames?: string[], // installed NPM package names
  isHeadless?: boolean, // false by default
  logMessage?: (msg: string) => void
}

const runIosApp: (options: TRunIosOptions) => Promise<() => void>
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
  isHeadless: false,
  logMessage: console.log
})
```
