import path from 'path'

export const getAppPath = (appName: string) => path.join('.rebox', `${appName}.apk`)
