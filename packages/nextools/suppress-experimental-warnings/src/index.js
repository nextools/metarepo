const { emitWarning } = process

process.emitWarning = (warning, arg, ...rest) => {
  if (arg === 'ExperimentalWarning') {
    return
  }

  return emitWarning(warning, arg, ...rest)
}
