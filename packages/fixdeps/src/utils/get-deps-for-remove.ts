export const getDepsToRemove = (entries: [string, string][], deps: string[], ignored: string[]): string[] => {
  const removedDeps: string[] = []

  for (const [name] of entries) {
    if (!ignored.includes(name) && !deps.includes(name)) {
      removedDeps.push(name)
    }
  }

  return removedDeps
}
