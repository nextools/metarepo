export type TWatchEvent = 'change' | 'add' | 'addDir' | 'unlink' | 'unlinkDir'

export type TWatchPathOptions = {
  events?: TWatchEvent[],
  atomicPollInverval?: number,
  writeStabilityThreshold?: number,
  writePollInterval?: number,
  pollingInterval?: number,
  pollingBinaryInterval?: number,
  shouldUsePolling?: boolean,
  shouldIgnorePermissionErrors?: boolean,
  shouldIgnoreInitialEvents?: boolean,
  shouldFollowSymlinks?: boolean,
}

export type TWatchPathResult = {
  event: string,
  path: string,
}
