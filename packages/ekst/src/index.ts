const extReg = (ext: string): RegExp => new RegExp(`\\${ext}(?=\\.|$)`, 'ig')

export const appendExt = (ext: string) => (file: string): string => `${file}${ext}`
export const prependExt = (ext: string) => (file: string): string => file.replace('.', `${ext}.`)
export const replaceExt = (ext1: string, ext2: string) => (file: string): string => file.replace(extReg(ext1), ext2)
export const removeExt = (ext: string) => replaceExt(ext, '')
