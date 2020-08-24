import path from 'path'
import enhancedResolve from 'enhanced-resolve'
import getCallerFile from 'get-caller-file'

export const rsolve = (id: string, fieldName: string) => new Promise<string>((resolve, reject) => {
  const callerDir = path.dirname(getCallerFile(4))
  const resolver = enhancedResolve.create({
    mainFields: [fieldName],
  })

  resolver(callerDir, id, (err, result) => {
    if (err !== null) {
      return reject(err)
    }

    resolve(result)
  })
})
