const TOKEN_LENGTH = 156

export const validateToken = (token: any) => {
  if (typeof token !== 'string' || token.length !== TOKEN_LENGTH) {
    throw new Error(`Invalid \`token\` format, it must be ${TOKEN_LENGTH} chars string`)
  }
}
