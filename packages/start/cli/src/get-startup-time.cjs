const startTime = process.hrtime.bigint()

exports.getStartupTime = () => (process.hrtime.bigint() - startTime) / BigInt(1e6)

