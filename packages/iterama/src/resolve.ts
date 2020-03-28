export const resolve = <T> (iterator: Iterator<T>): Promise<void> => {
  const handle = async (ir: IteratorResult<T>): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return ir.done ? void 0 : handle(iterator.next(await ir.value))
  }

  return handle(iterator.next())
}
