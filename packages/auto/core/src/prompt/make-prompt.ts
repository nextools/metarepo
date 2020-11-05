import dleet from 'dleet'
import { readFile, writeFile } from 'pifs'
import prompts from 'prompts'
import { spawnChildProcess } from 'spown'
import type { TReadonly } from 'tsfn'
import type { TPackageBumpMap } from '../bump/types'
import type { TPromptEditData, TPackageMap } from '../types'
import { makeEmptyEditData } from '../utils'
import { answerToEditResult } from './answer-to-edit-result'
import { getEditor } from './get-editor'
import { log } from './log'
import { makeQuestionObject } from './make-question-object'
import { mergeEditResults } from './merge-edit-results'
import type { TPromptResult, TQuestionObj } from './types'

const PROMPT_FILE_PATH = './node_modules/@auto/.EDIT.json'

const resultYes = (): TPromptResult => ({ type: 'YES' })
const resultNo = (): TPromptResult => ({ type: 'NO' })
const resultEdit = (res: TReadonly<TPromptEditData>): TPromptResult => ({ type: 'EDIT', ...res })
const isEmptyQuestion = (question: TQuestionObj): boolean => Object.keys(question).length === 0

export const makePrompt = async (packages: TReadonly<TPackageMap>, bumps: TReadonly<TPackageBumpMap>, prevEditResult: TReadonly<TPromptEditData> = makeEmptyEditData()): Promise<TPromptResult> => {
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: 'Looks good?',
    choices: [
      { title: 'no', value: 'NO' },
      { title: 'yes', value: 'YES' },
      { title: 'edit', value: 'EDIT' },
    ],
    initial: 0,
  })

  if (value === 'EDIT') {
    const question = makeQuestionObject(packages, bumps, prevEditResult)

    if (isEmptyQuestion(question)) {
      log('No changes to make')

      return resultEdit(prevEditResult)
    }

    // ask user to edit
    await writeFile(PROMPT_FILE_PATH, JSON.stringify(question, null, 2))

    const editor = await getEditor()

    await spawnChildProcess(
      `${editor} ${PROMPT_FILE_PATH}`,
      {
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr,
      }
    )

    const answerData = await readFile(PROMPT_FILE_PATH, 'utf8')

    await dleet(PROMPT_FILE_PATH)

    // parse answer
    let answer: TQuestionObj

    try {
      answer = JSON.parse(answerData)
    } catch {
      log('Error while parsing the answer')

      return resultEdit(prevEditResult)
    }

    return resultEdit(
      mergeEditResults(
        prevEditResult,
        answerToEditResult(question, answer)
      )
    )
  }

  if (value === 'YES') {
    return resultYes()
  }

  return resultNo()
}
