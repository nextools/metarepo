export type TDepsEntries = [string, string][]

export type TDepsObject = {[k: string]: string}

export type TOptions = {
  workspacePackagesFilter: (path: string) => boolean,
  ignoredPackages?: string[],
  logMessage?: (message: string) => void,
  logPath?: (message: string) => void,
}
