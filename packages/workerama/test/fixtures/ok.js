exports.test = (arg) => async (item) => {
  if (!item.done) {
    await Promise.resolve()

    return { value: item.value + arg }
  }
}
