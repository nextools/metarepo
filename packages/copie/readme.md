# copie

Copy a file.

* no CLI
* no globs
* no `mkdir -p`
* no side effects such as `stdout`
* Promise only API
* preserve `uid`, `gid`, `mode`, `atime` and `mtime` stats

## Install

```sh
$ yarn add copie
```

## Usage

```js
import copie from 'copie'

copie('/from/file/path', '/to/file/path')
  .then(() => console.log('done'))
  .catch(console.error)
```
