# nocean ![npm](https://flat.badgen.net/npm/v/nocean)

Notion API client.

⚠️ Only one concurrent task is currently supported.

## Install

```sh
$ yarn add nocean
```

## Usage

```ts
type TDownloadMarkdownOptions = {
  // value of `token_v2` cookie
  token: string
  // https://www.notion.so/<ACCOUNT>/<PAGE>-<BLOCK_ID>
  blockId: string,
  // relative to current working directory
  outputDirPath: string,
}

const downloadMarkdown: (options: TDownloadMarkdownOptions) => Promise<string>
```

```ts
import { downloadMarkdown } from 'nocean'

const result = await downloadMarkdown({
  token: '<TOKEN>',
  blockId: '<BLOCK_ID>',
  outputDirPath: 'notion/',
})

console.log(result)
// /Users/foo/bar/baz/notion
```
