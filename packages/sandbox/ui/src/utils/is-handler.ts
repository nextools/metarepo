const HANDLERS_REGEXP = /^on[A-Z]/

export const isHandler = (key: string): boolean => HANDLERS_REGEXP.test(key)
