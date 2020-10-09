export const requestAnimationFrame = (global as any as Window).requestAnimationFrame || global.setImmediate
export const cancelAnimationFrame = (global as any as Window).cancelAnimationFrame || global.clearImmediate
