import { Transform } from 'stream'
import { ReadStream } from 'fs'
import plugin from '@start/plugin'
import { isString } from 'tsfn'

const TEMPLATES_PATH = './tasks/pkg/'

const unplaceholder = (str: string) => {
  return str
    .replace(/\$/g, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
}

export type TReplacers = {
  [k: string]: {
    [k: string]: string | null,
  },
}

export const Pkg = (replacers?: TReplacers) => (packagePath: string) =>
  plugin('template', ({ logPath, logMessage }) => async () => {
    if (!isString(packagePath)) {
      throw '<package path> argument is required'
    }

    const { default: prompts } = await import('prompts')
    const path = await import('path')
    const { default: globby } = await import('globby')
    const { default: makeDir } = await import('make-dir')
    const { createReadStream, createWriteStream, readFile, writeFile, readdir } = await import('pifs')
    const { replaceStream } = await import('rplace')
    // @ts-ignore
    const nanomatch = await import('nanomatch')

    const templatesPath = path.resolve(TEMPLATES_PATH)
    let templateNames = [] as string[]

    try {
      templateNames = await readdir(templatesPath)
    } catch {}

    if (templateNames.length === 0) {
      throw `No templates found in ${TEMPLATES_PATH}`
    }

    let type = null

    if (templateNames.length === 1) {
      type = templateNames[0]
    } else {
      const result = await prompts(
        {
          type: 'select',
          name: 'type',
          message: 'Choose package type',
          choices: templateNames.map((templateName) => ({
            title: templateName,
            value: templateName,
          })),
        },
        {
          onCancel: () => {
            throw 'canceled'
          },
        }
      ) as { type: string }

      type = result.type
    }

    const { name } = await prompts(
      {
        type: 'text',
        name: 'name',
        message: 'Enter package name',
        validate: (value) => value.length > 0,
      },
      {
        onCancel: () => {
          throw 'canceled'
        },
      }
    ) as { name: string }

    const userReplacers = {} as { [k: string]: string }

    if (replacers?.[type]) {
      for (const [key, value] of Object.entries(replacers[type])) {
        if (value === null) {
          const { result } = await prompts(
            {
              type: 'text',
              name: 'result',
              message: `Enter ${unplaceholder(key)}`,
              validate: (value) => value.length > 0,
            },
            {
              onCancel: () => {
                throw 'canceled'
              },
            }
          ) as { result: string }

          userReplacers[key] = result
        } else {
          userReplacers[key] = value
        }
      }
    }

    const allReplacers = {
      ...userReplacers,
      $name$: name,
    }

    const files = await globby(
      [`${TEMPLATES_PATH}${type}/**/*`],
      {
        ignore: ['node_modules/**'],
        deep: Infinity,
        onlyFiles: true,
        expandDirectories: false,
        absolute: true,
      }
    )

    const templatePath = path.join(templatesPath, type)
    const pkgPath = path.resolve(`./packages/${packagePath}/`)

    for (const filePath of files) {
      const newFilePath = filePath.replace(templatePath, pkgPath)
      const newFileDirPath = path.dirname(newFilePath)

      await makeDir(newFileDirPath)

      const readStream = createReadStream(filePath)
      const writeStream = createWriteStream(newFilePath)

      await new Promise((resolve, reject) => {
        let stream: ReadStream | Transform = readStream.on('error', reject)

        for (const [key, value] of Object.entries(allReplacers)) {
          stream = stream
            .pipe(replaceStream(key, value))
            .on('error', reject)
        }

        stream
          .pipe(writeStream)
          .on('error', reject)
          .on('finish', resolve)
      })

      logPath(newFilePath)
    }

    const pkgJsonPath = path.resolve('./package.json')
    const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf8'))
    const pkgWorkspacePath = `packages/${packagePath}`

    if (!nanomatch.some(pkgWorkspacePath, pkgJson.workspaces)) {
      pkgJson.workspaces.push(pkgWorkspacePath)
      pkgJson.workspaces.sort()

      await writeFile(pkgJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`, 'utf8')

      logMessage('add new package to Yarn Workspace')
    }
  })
