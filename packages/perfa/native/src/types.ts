export type TGetPerfDataOptions = {
  entryPointPath: string,
  dependencyNames?: string[],
  fontsDir?: string,
}

export type TPerfData = {
  viewCount: number,
  usedMemory: number,
}
