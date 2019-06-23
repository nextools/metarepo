const extReg = (ext: string) => new RegExp(`\\${ext}(?=\\.|$)`, 'ig')

export const appendExt = (file: string, ext: string) => `${file}${ext}`
export const prependExt = (file: string, ext: string) => file.replace('.', `${ext}.`)
export const replaceExt = (file: string, ext1: string, ext2: string) => file.replace(extReg(ext1), ext2)
export const removeExt = (file: string, ext: string) => replaceExt(file, ext, '')
