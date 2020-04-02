import path from 'path'

export const getAndroidProjectPath = (appName: string): string => path.resolve('node_modules', '.rebox', appName, 'android')
