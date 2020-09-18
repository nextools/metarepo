export type TDependents = Set<{ pkgName: string, range: string }>
export type TDepsMap = Map</* depName */string, TDependents>
export type TDeps = Map</* depName */string, { range: string, dependents: TDependents }>

export type TDuplicatedDependencies = Map</* pkgName */string, TDeps>
