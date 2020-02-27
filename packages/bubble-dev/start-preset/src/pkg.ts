import { Transform } from 'stream'
import { ReadStream, Dirent, Stats } from 'fs'
import plugin from '@start/plugin'

const TEMPLATES_PATH = './tasks/pkg/'

const unplaceholder = (str: string) => {
  return str
    .replace(/\$/g, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
}

type TFileStats = {
  name: string,
  path: string,
  dirent: Dirent,
  stats: Stats,
}

export type TReplacers = {
  [k: string]: {
    [k: string]: string | null,
  },
}

export const Pkg = (replacers?: TReplacers) => (packagePath: string) =>
  plugin('template', ({ logPath, logMessage }) => async () => {
    const { isString } = await import('tsfn')

    if (!isString(packagePath)) {
      throw '<package path> argument is required'
    }

    const { default: prompts } = await import('prompts')
    const path = await import('path')
    const { default: globby } = await import('globby')
    const { default: makeDir } = await import('make-dir')
    const {
      createReadStream,
      createWriteStream,
      readFile,
      writeFile,
      readdir,
      symlink,
      readlink,
    } = await import('pifs')
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

    const templatePath = path.join(templatesPath, type)
    const pkgPath = path.resolve(`./packages/${packagePath}/`)

    const files = await globby(
      `${TEMPLATES_PATH}${type}/**/*`,
      {
        ignore: ['node_modules/**'],
        deep: Infinity,
        onlyFiles: false,
        expandDirectories: false,
        absolute: true,
        stats: true,
        followSymbolicLinks: false,
      }
    ) as unknown as TFileStats[]

    // directories first
    files.sort((file) => (file.stats.isDirectory() ? -1 : 1))

    for (const file of files) {
      const newFilePath = file.path.replace(templatePath, pkgPath)

      if (file.stats.isSymbolicLink()) {
        const symlinkTarget = await readlink(file.path)

        // no 3rd argument – autodetect target 'file' | 'dir' type
        await symlink(symlinkTarget, newFilePath)

        logPath(newFilePath)

        continue
      }

      if (file.stats.isDirectory()) {
        await makeDir(newFilePath)

        continue
      }

      const readStream = createReadStream(file.path)
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
