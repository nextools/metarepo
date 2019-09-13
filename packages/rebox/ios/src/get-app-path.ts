import path from 'path'

export const getAppPath = (appName: string) => path.join('node_modules', '.rebox', appName, 'ios', `${appName}.app`)
