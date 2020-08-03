## v2.0.0

* 💥 skip files with empty transpiled code

  ```
  technically it's a breaking change for projects without type-only imports/exports:
  
  `import { TType } from './types'` will still be there but file itself will disappear
  ```

## v1.0.0

* 💥 drop Node.js v8 support and require >=10.13.0 (first v10 LTS)

* ♻️ update dependencies: `@start/plugin`
