// based on https://stackoverflow.com/a/25663729
// "makes sure there are even number of quotes after a space"
// https://regex101.com/r/eJ9jP3/25
const SPLIT_REGEXP = /(?<!\\)\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/g
const REPLACE_REGEXP = /^"(.+)"$/

export const splitCommand = (str: string): string[] =>
  str.split(SPLIT_REGEXP).map((arg) => {
    return arg.replace(REPLACE_REGEXP, '$1')
  })
