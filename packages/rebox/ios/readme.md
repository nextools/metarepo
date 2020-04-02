# @rebox/ios

Set of helpers to deal with React Native on iOS.

## Requirements

* Xcode 11.4
* iOS Simulator 13.2

## Setup

```sh
brew install cocoapods
```

## Usage

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
  deviceId?: string
}

const installIosApp: (options: TInstallIosAppOptions) => Promise<void>
```

```ts
type TUninstallIosAppOptions = {
  appId: string,
  deviceId?: string
}

const uninstallIosApp: (options: TUninstallIosAppOptions) => Promise<void>
```

```ts
type TRunSimulatorOptions = {
  iPhoneVersion: number,
  iOSVersion: string,
  isHeadless?: boolean
}

const runIosSimulator: (options: TRunSimulatorOptions) => Promise<() => void>
```

```ts
type TLaunchIosAppOptions = {
  appId: string,
  deviceId?: string
}

const launchIosApp: (options: TLaunchIosAppOptions) => Promise<void>
```

```ts
type TRunIosOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  iOSVersion: string,
  iPhoneVersion: number,
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
  logMessage?: (msg: string) => void
}

const runIosApp: (options: TRunIosOptions) => Promise<() => void>
```
