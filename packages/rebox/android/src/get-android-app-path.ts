import path from 'path'

export const getAndroidAppPath = (appName: string): string => path.resolve('.rebox', `${appName}.apk`)
