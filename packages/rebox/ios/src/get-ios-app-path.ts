import path from 'path'

export const getIosAppPath = (appName: string): string => path.resolve('.rebox', `${appName}.app`)
