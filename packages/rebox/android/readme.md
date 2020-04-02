# @rebox/android

Set of helpers to deal with React Native on Android.

## Install

```sh
$ yarn add --dev @rebox/android
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
sdkmanager "platform-tools" "platforms;android-28" "build-tools;28.0.3" "emulator" "extras;android;m2repository" "system-images;android-28;google_apis;x86"
```

## Usage

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
  deviceId?: string
}

const uninstallAndroidApp: (options: TUninstallAndroidAppOptions) => Promise<void>
```

```ts
type TRunAndroidEmulatorOptions = {
  portsToForward: number[],
  isHeadless?: boolean
}

const runAndroidEmulator: (options: TRunAndroidEmulatorOptions) => Promise<() => void>
```

```ts
type TLaunchAndroidAppOptions = {
  appId: string,
  deviceId?: string
}

const launchAndroidApp: (options: TLaunchAndroidAppOptions) => Promise<void>
```

```ts
type TRunAndroidAppOptions = {
  appName: string,
  appId: string,
  entryPointPath: string,
  portsToForward: number[],
  fontsDir?: string,
  dependencyNames?: string[],
  isHeadless?: boolean,
  logMessage?: (msg: string) => void
}

const runAndroidApp: (options: TRunAndroidAppOptions) => Promise<() => void
```
