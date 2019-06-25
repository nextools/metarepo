# ⬛️ cli

CLI entry point, [ESM](https://github.com/standard-things/esm) included.

## Install

```sh
$ yarn add --dev @start/cli
```

## Usage

### Example

```js
// package.json

"start": {
  // `./tasks` by default if there is no `preset` option
  "file": "./my-tasks-file",
  // module name as a preset, overrides `file` option
  "preset": "my-awesome-start-preset",
  // modules to require before anything else, kinda `node -r`
  "require": [
    // module name
    "whatever-require-hook-lib",
    // or a tuple with settings, just like in Babel
    [
      "@babel/register",
      {
        "extensions": [
          ".ts",
          ".js"
        ]
      }
    ]
  ],
  // reporter module name
  "reporter": "@start/reporter-verbose"
}
```

```sh
$ yarn start

One of the following task names is required:
* foo
* bar
* baz
```

```sh
$ yarn start foo
$ yarn start bar arg
$ yarn start baz arg1 arg2
```
