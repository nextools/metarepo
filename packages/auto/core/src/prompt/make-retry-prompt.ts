import prompts from 'prompts'

export const makeRetryPrompt = async (): Promise<void> => {
  await prompts({
    type: 'select',
    name: 'value',
    message: 'Fix the above issue',
    choices: [
      { title: 'Try Again', value: 'YES' },
    ],
    initial: 0,
  })
}
