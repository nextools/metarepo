This is A WEB COMPONENT, in the next version we will add native variation.

`Table`, `TableBody`, `TableBodyCell`, `TableHead`, `TableHeadCell`, `TableRow` are use in order to render web tables.

These map to the same corresponding props in Web.

## Raw type definitions

Table:
```ts
export type TTable = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
  borderColor?: string,
  borderTopWidth?: number,
  borderBottomWidth?: number,
  borderLeftWidth?: number,
  borderRightWidth?: number,
  borderStyle?: string,
}
```

TableBody:
```ts
export type TTableBody = {
  id?: string,
  children?: ReactNode,
}
```

TableBodyCell:
```ts
export type TTableBodyCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
  borderColor?: string,
  borderTopWidth?: number,
  borderBottomWidth?: number,
  borderLeftWidth?: number,
  borderRightWidth?: number,
  borderStyle?: string,
}
```

TableHead:
```ts
export type TTableHead = {
  id?: string,
  children?: ReactNode,
}
```

TableHeadCell:
```ts
export type TTableHeadCell = {
  id?: string,
  children?: ReactNode,
  backgroundColor?: string,
  borderColor?: string,
  borderTopWidth?: number,
  borderBottomWidth?: number,
  borderLeftWidth?: number,
  borderRightWidth?: number,
  borderStyle?: string,
}
```

TableRow:
```ts
export type TTableRow = {
  id?: string,
  children?: ReactNode,
}
```

