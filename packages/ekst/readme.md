# ekst

Append, prepend, replace or remove [basename](https://nodejs.org/api/path.html#path_path_basename_path_ext) extensions.

## Install

```sh
$ yarn add ekst
```

## Usage

```js
import { appendExt, prependExt, replaceExt, removeExt } from 'ekst'

appendExt('file.a.b', '.c') // file.a.b.c
prependExt('file.b.c', '.a') // file.a.b.c
replaceExt('file.a.d.d.c', '.d', '.b') // file.a.b.b.c
removeExt('file.a.d.b.d.c.d.d', '.d') // file.a.b.c
```
