# @nextools/typescript-esm-loader ![npm](https://flat.badgen.net/npm/v/@nextools/typescript-esm-loader)

Experimental TypeScript ESM Loader for Node.js >= 12.17.0.

## Install

```sh
$ yarn add @nextools/typescript-esm-loader
```

## Usage

```sh
node --require @nextools/suppress-experimental-warnings --experimental-import-meta-resolve --experimental-loader @nextools/typescript-esm-loader ./module.ts
```
