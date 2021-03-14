export const startTimeNs = (): (() => bigint) => {
  const startTime = process.hrtime.bigint()

  return () => process.hrtime.bigint() - startTime
}

export const startTimeMs = (): (() => bigint) => {
  const endTime = startTimeNs()

  return () => endTime() / BigInt(1e6)
}
