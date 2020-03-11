import path from 'path'

export const getProjectPath = (appName: string): string => path.join('node_modules', '.rebox', appName, 'ios')
