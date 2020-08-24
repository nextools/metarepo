export const LOG_ACTION = 'CONSOLE_LOG_ACTION'
export const CLEAR_ACTION = 'CONSOLE_CLEAR_ACTION'

export const consoleLogAction = (line: string) => ({
  type: LOG_ACTION,
  payload: line,
})

export const consoleClearAction = () => ({
  type: CLEAR_ACTION,
})
