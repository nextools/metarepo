import path from 'path'

export const getAppPath = (appName: string): string => path.join('.rebox', `${appName}.apk`)
