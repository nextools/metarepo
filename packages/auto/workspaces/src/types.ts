export type TDependent = {
  name: string,
  range: string | null,
  devRange: string | null
}

export type TCrossDependents = {
  [name: string]: TDependent[]
}
