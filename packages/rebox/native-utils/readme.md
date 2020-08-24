# @rebox/native-utils ![npm](https://flat.badgen.net/npm/v/@rebox/native-utils)

Set of common helpers to deal with React Native on iOS and Android.

## Install

```sh
$ yarn add @rebox/native-utils
```

## API

```ts
type TBuildJsBundleOptions = {
  entryPointPath: string,
  outputPath: string,
  platform: 'ios' | 'android'
}

const buildNativeJsBundle: (options: TBuildJsBundleOptions) => Promise<string>
```

```ts
type TServeNativeJsBundleOptions = {
  entryPointPath: string,
  port: number,
  platform: 'ios' | 'android',
  isDev?: boolean, // `&dev=`, true by default
  shouldMinify?: boolean // `&minify=`, false by default
}

const serveNativeJsBundle: (options: TServeNativeJsBundleOptions) => Promise<() => void>

```

```ts
type TCopyNativeTemplateOptions = {
  projectPath: string,
  platform: 'ios' | 'android'
}

const copyNativeTemplate: (options: TCopyNativeTemplateOptions) => Promise<void>
```
