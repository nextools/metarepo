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
  (input: string, choices: TPrompt[]): Promise<TPrompt[]> => {
    if (input.includes('*')) {
      const regExp = makeRegExp(input)
      const filteredChoices = choices.filter((choice) => regExp.test(choice.value))

      return Promise.resolve([
        { title: `${input} (${filteredChoices.length})`, value: input },
        ...filteredChoices,
      ])
    }

    if (noPackageMessage === null) {
      return Promise.resolve(
        choices.filter((choice) => choice.value.includes(input))
      )
    }

    let firstElement: TPrompt[] = []

    if (input === '') {
      firstElement = [{ title: noPackageMessage, value: '-' }]
    }

    return Promise.resolve([
      ...firstElement,
      ...choices.filter((choice) => choice.value.includes(input)),
    ])
  }

export type TStartOptions = {
  file?: string,
  auto?: {
    shouldMakeGitTags?: boolean,
    shouldMakeGitHubReleases?: boolean,
    shouldSendSlackMessage?: boolean,
    shouldSendTelegramMessage?: boolean,
    shouldWriteChangelogFiles?: boolean,
  },
}

export const getStartOptions = async () => {
  const path = await import('path')
  const { start } = await import(path.resolve('./package.json'))

  return start as TStartOptions
}
