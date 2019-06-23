# dleet

[![npm](https://img.shields.io/npm/v/dleet.svg?style=flat-square)](https://www.npmjs.com/package/dleet) [![tests](https://img.shields.io/travis/deepsweet/dleet/master.svg?label=tests&style=flat-square)](https://travis-ci.org/deepsweet/dleet) [![coverage](https://img.shields.io/codecov/c/github/deepsweet/dleet.svg?style=flat-square)](https://codecov.io/github/deepsweet/dleet)

Delete directories and files. Yet another one of many similar to `rm -rf` packages. However:

* no CLI
* no globs
* Promise only API
* Windows errors handling:
  * an attempt to fix `EPERM` and retry
  * an attempt to wait and retry few times on `EBUSY`

## Requirements

* Node.js >= 8.6.0

## Install

```sh
$ yarn add dleet
# or
$ npm install dleet
```

## Usage

```js
import dleet from 'dleet'

dleet('/file/or/directory/path')
  .then(() => console.log('done'))
  .catch(console.error)
```
