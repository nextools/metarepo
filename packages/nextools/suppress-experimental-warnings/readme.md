# @nextools/suppress-experimental-warnings ![npm](https://flat.badgen.net/npm/v/@nextools/suppress-experimental-warnings)

Suppress experimental warnings in Node.js.

* https://github.com/nodejs/node/issues/30810
* https://github.com/nodejs/node/pull/36137

## Install

```sh
$ yarn add @nextools/suppress-experimental-warnings
```

## Usage

```sh
node --require @nextools/suppress-experimental-warnings --experimental-import-meta-resolve --experimental-loader @nextools/typescript-esm-loader ./module.ts
```
