import fs from 'fs'

export const getData = () => fs.promises.readFile(require.resolve('./data.txt'), 'utf8')
