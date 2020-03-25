exports.test = (arg) => async (item) => {
  await Promise.resolve()

  return { value: item + arg }
}
