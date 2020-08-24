export const waitFor = async (ticks: number[], index: number): Promise<void> => {
  for (let i = 0; i < ticks[index]; i++) {
    await Promise.resolve()
  }
}
