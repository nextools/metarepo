export const remove = async (iterable: AsyncIterable<string>): Promise<AsyncIterable<string>> => {
  const { mapAsync } = await import('iterama')
  const { default: dleet } = await import('dleet')

  return mapAsync(async (path: string) => {
    await dleet(path)

    return path
  })(iterable)
}
