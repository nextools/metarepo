import path from 'path'

export const getProjectPath = (appName: string) => path.join('node_modules', '.rebox', appName, 'ios')
