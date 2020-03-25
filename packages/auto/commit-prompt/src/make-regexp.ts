import escapeStringRegexp from 'escape-string-regexp'

export const makeRegExp = (input: string) => {
  const escapedInput = escapeStringRegexp(input).replace(/\\\*/g, '.*')

  return new RegExp(escapedInput)
}
