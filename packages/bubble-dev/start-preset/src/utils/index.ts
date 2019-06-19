import escapeStringRegexp from 'escape-string-regexp'

export type TPrompt = {
  title: string,
  value: string,
}

export const makeRegExp = (input: string) => {
  const escapedInput = escapeStringRegexp(input).replace(/\\\*/g, '.*')

  return new RegExp(escapedInput)
}

export const suggestFilter = (noPackageMessage: string | null) =>
  (input: string, choices: TPrompt[]): TPrompt[] => {
    if (input.includes('*')) {
      const regExp = makeRegExp(input)
      const filteredChoices = choices.filter((choice) => regExp.test(choice.value))

      return [
        { title: `${input} (${filteredChoices.length})`, value: input },
        ...filteredChoices,
      ]
    }

    if (noPackageMessage === null) {
      return choices.filter((choice) => choice.value.includes(input))
    }

    let firstElement: TPrompt[] = []

    if (input === '') {
      firstElement = [{ title: noPackageMessage, value: '-' }]
    }

    return [
      ...firstElement,
      ...choices.filter((choice) => choice.value.includes(input)),
    ]
  }
