# dleet

Delete directories and files. Yet another one of many similar to `rm -rf` packages. However:

* no CLI
* no globs
* Promise only API
* Windows errors handling:
  * an attempt to fix `EPERM` and retry
  * an attempt to wait and retry few times on `EBUSY`

## Install

```sh
$ yarn add dleet
```

## Usage

```js
import dleet from 'dleet'

dleet('/file/or/directory/path')
  .then(() => console.log('done'))
  .catch(console.error)
```
