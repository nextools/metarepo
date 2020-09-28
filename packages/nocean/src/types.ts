export type TTask = {
  eventName: 'exportBlock',
  request: {
    blockId: string,
    recursive: boolean,
    exportOptions: {
      exportType: 'markdown',
      timeZone: string,
      locale: 'en',
    },
  },
}

export type TResponseActor = {
  table: 'notion_user',
  id: string,
}

export type TGetTaskInProgressResponse = {
  id: string,
  actor: TResponseActor,
  state: 'in_progress',
}

export type TGetTaskFailureResponse = {
  id: string,
  actor: TResponseActor,
  state: 'failure',
  error: string,
}

export type TGetTaskSuccessResponse = {
  id: string,
  actor: TResponseActor,
  state: 'success',
  status: {
    type: 'complete',
  },
}

export type TTaskExportBlockResponse = TGetTaskSuccessResponse & {
  status: {
    pagesExported: number,
    exportURL: string,
  },
}

export type TGetTasksResponse = {
  results: (TGetTaskInProgressResponse | TGetTaskFailureResponse | TGetTaskSuccessResponse)[],
}

export type TEnqueueTaskSuccessResponse = {
  taskId: string,
}

export type TGetTaskOptions = {
  token: string,
  taskId: string,
}

export type TEnqueueTaskOptions = TTask & {
  token: string,
}

export type TDownloadMarkdownOptions = {
  token: string,
  blockId: string,
  outputDirPath: string,
}

