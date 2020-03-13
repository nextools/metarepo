import plugin, { StartDataFilesProps } from '@start/plugin'
import { Preset } from 'unified'

export default (preset: Preset) =>
  plugin<StartDataFilesProps, StartDataFilesProps>('remark-lint', () => async ({ files }) => {
    const path = await import('path')
    const { default: remark } = await import('remark')
    // @ts-ignore
    const { default: report } = await import('vfile-reporter')

    const results = await Promise.all(
      files.map(async (file) => {
        const result = await remark()
          .use(preset)
          .process({
            path: path.relative(process.cwd(), file.path),
            contents: file.data,
          })

        return result
      })
    )

    const output = report(results, { quiet: true })

    if (output.length > 0) {
      console.error(`\n${output}\n`)

      throw null
    }

    return { files }
  })
