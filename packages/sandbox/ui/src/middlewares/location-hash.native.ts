import { Middleware } from 'redux'

export const locationHash: Middleware = () => (next) => (action) => next(action)
