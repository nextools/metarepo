import path from 'path'

export const getIosProjectPath = (appName: string): string => path.resolve('node_modules', '.rebox', appName, 'ios')
