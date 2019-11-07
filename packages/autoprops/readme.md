# Autoprops
[npm](https://flat.badgen.net/npm/v/autoprops)
The tool that generates all possible combinations of props and children based on declarative config respecting `mutex` and `mutin` features.
## Installation
```sh
yarn add autoprops
```
## Terminology
- [ComponentConfig](#ComponentConfig)
- [Permutation Index](#permutation-index)
- [ChildrenMap](#ChildrenMap)
## API
- [getProps](#getProps)
- [applyPropValue](#applyPropValue)
- [getPropsIterable](#getPropsIterable)
- [mapPropsIterable](#mapPropsIterable)
- [createChildren](#createChildren)
- [getChildrenKeys](#getChildrenKeys)
- [isChildrenMap](#isChildrenMap)
# Terminology
## ComponentConfig
Is a configuration object which `autoprops` uses to generate props.

The shape of the object is:
```ts
type TComponentConfig = {
  props: {
    [K: string]: any[]
  },
  children?:{
    [K: string]: {
      Component: FC<any>,
      config: TComponentConfig,
    }
  },
  required?: string[][],
  mutex?: string[][],
  mutin?: string[][],
}
```

## Minimal `ComponentConfig` object
```ts
import { TComponentConfig, getPropsIterable } from 'autoprops'

const config: TComponentConfig = {
  props: {
    numericProp: [0, 1],
    isOk: [true]
  },
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be:
```sh
{}
{ isOk: true }
{ numericProp: 0 }
{ isOk: true, numericProp: 0 }
{ numericProp: 1 }
{ isOk: true, numericProp: 1 }
```
## Children
Children can be defined in two ways
- Children as a normal prop, with values as React Elements.
- Children as references to other `ComponentConfig` objects.

## Children as a normal prop
```tsx
import { TComponentConfig, getPropsIterable } from 'autoprops'

const config: TComponentConfig = {
  props: {
    isOk: [true],
    children: [
      'text child',
      <span>element child</span>
    ]
  },
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be
```sh
{}
{ isOk: true }
{ children: 'text child' }
{ isOk: true, children: 'text child' }
{ children: { $$typeof: 'react.element' } }
{ isOk: true, children: { $$typeof: 'react.element' } }
```
## Children as references to `ComponentConfig`
```tsx
import { TComponentConfig, getPropsIterable } from 'autoprops'

const childConfig: TComponentConfig = {
  props: {
    childProp: [true]
  }
}

const config: TComponentConfig = {
  props: {
    isOk: [true],
  },
  children: {
    childKey: {
      Component: () => null,
      config: childConfig
    },
    /* Reference more children here */
  }
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be
```sh
{}
{ isOk: true }
{ children: { $$typeof: 'react.element' } }
{ isOk: true, children: { $$typeof: 'react.element' } }
{ children: { $$typeof: 'react.element', props: { childProp: true } } }
{ isOk: true, children: { $$typeof: 'react.element', props: { childProp: true } } }
```
## Required field
`required` field in `ComponentConfig` is used to tell autoprops to
- include property with such name in every props instance
- include child with such key in every permutation
```ts
import { TComponentConfig, getPropsIterable } from 'autoprops'

const config: TComponentConfig = {
  props: {
    isOk: [true],
    numericProp: [0, 1]
  },
  required: ['isOk']
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be
```sh
{ isOk: true }
{ isOk: true, numericProp: 0 }
{ isOk: true, numericProp: 1 }
```
As you can see - required field `isOk` is always presented in props instances.
Let's see the example with children:
```ts
import { TComponentConfig, getPropsIterable } from 'autoprops'

const childConfig: TComponentConfig = {
  props: {
    childProp: [true]
  }
}

const config: TComponentConfig = {
  props: {
    isOk: [true],
  },
  children: {
    childKey: {
      Component: () => null,
      config: childConfig
    },
  },
  required: ['isOk', 'childKey']
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be:
```sh
{ isOk: true, children: { $$typeof: 'react.element' } }
{ isOk: true, children: { $$typeof: 'react.element', props: { childProp: true } } }
```
## Mutex field
Is used to define groups of mutually exclusive props and children.
```ts
import { TComponentConfig } from 'autoprops'

import { TComponentConfig, getPropsIterable } from 'autoprops'

const childConfig: TComponentConfig = {
  props: {
    childProp: [true]
  }
}

const config: TComponentConfig = {
  props: {
    isOk: [true],
  },
  children: {
    childKey: {
      Component: () => null,
      config: childConfig
    },
  },
  mutex: [
    ['isOk', 'childKey'],
  ]
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be:
```sh
{}
{ isOk: true }
{ children: { $$typeof: 'react.element' } }
{ children: { $$typeof: 'react.element', props: { childProp: true } } }
```
`childKey` and `isOk` props are not allowed to be placed into one props instance. They are mutually exclusive now.
## Mutin field
Is used to define groups of mutually inclusive props and children.
```ts
import { TComponentConfig } from 'autoprops'

import { TComponentConfig, getPropsIterable } from 'autoprops'

const childConfig: TComponentConfig = {
  props: {
    childProp: [true]
  }
}

const config: TComponentConfig = {
  props: {
    isOk: [true],
  },
  children: {
    childKey: {
      Component: () => null,
      config: childConfig
    },
  },
  mutin: [
    ['isOk', 'childKey'],
  ]
}

/* lets iterate over generated props */
for (const { props } of getPropsIterable(config)) {
  console.log(props)
}
```
The output will be:
```sh
{}
{ isOk: true, children: { $$typeof: 'react.element' } }
{ isOk: true, children: { $$typeof: 'react.element', props: { childProp: true } } }
```
`childKey` and `isOk` props are either both missing or both present in resulting props instances.
# Permutation Index
Special `string` type identifier which can be used to get specific props instance from `autoprops`.
Initial index is always `'0'`.
```ts
import { getProps } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

const currentIndex = '0'

/* get the props by permutation index */
const props = getProps(config, currentIndex)
```
# ChildrenMap
Special object where
- keys are same as in `children` section of `ComponentConfig` object
- values are objects that are child props.

This kind of `children` object is useful for some UI, to display children and props hierarchies.

> Note: `getProps` returns such `children` object instead of normal React children
```ts
import { TComponentConfig, createChildren } from 'autoprops'

/* Having the following config objects  */
const childConfig: TComponentConfig = {
  props: {
    a: [true]
  }
}

const config: TComponentConfig = {
  props: {},
  children: {
    myChild: {
      config: childConfig,
      Component: () => null
    },
    otherChild: {
      config: childConfig,
      Component: () => null
    }
  }
}

/* The following objects are valid `ChildrenMap` for defined configs */
const childrenMap_0 = {
  myChild: {},
  otherChild: { a: true }
}

const childrenMap_1 = {
  otherChild: {}
}

const childrenMap_2 = {
  myChild: { a: true }
}

/* ChildrenMap can be converted to React children using createChildren function */
const reactChildren = createChildren(config, childrenMap_0)
```
# API
## `getProps`
>`(config: TComponentConfig, index: string) => {[k: string]: any}`

Returns single props instance identified by provided permutation index string and config object.

> Note: `children` are generated in `ChildrenMap` form.
```ts
import { getProps, isChildrenMap, createChildren, TComponentConfig } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

/* get props for specific permutation index */
const props = getProps(config, '0')

/* props will contain children as ChildrenMap object */
if (isChildrenMap(props.children)) {
  /* generate React children from childrenMap */
  props.children = createChildren(config, props.children)
}
```
## `applyPropValue`
>`(config: TComponentConfig, index: string, propPath: string[], propValue: any): string => {}`

Tells what permutation index it would be, if the specified `value` would change at specified `propPath` starting from specified permutation index
```ts
import { applyPropValue, getProps, TComponentConfig } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

const currentIndex = '0'
const propPath = ['child', 'prop']
const applyValue = 'value'

/* apply prop value and get next permutation index */
const nextIndex = applyPropValue(config, currentIndex, propPath, applyValue)

/* use next index to get props */
const nextProps = getProps(config, nextIndex)
```
## `getPropsIterable`
>`<T>(config: TComponentConfig<T>) => Iterable<{ id: string, props: T, progress: number }>`

Returns `Iterable` that will iterate over all possible props instances
```ts
import { getPropsIterable, TComponentConfig } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

/* iterate over props */
for (const { id, props, progress } of getPropsIterable(config)) {
  /* ... */
}
```
## `mapPropsIterable`
>`<T, R>(config: TComponentConfig<T>, xf: (value: { id: string, props: T, progress: number }) => R): Iterable<R>`

Apply your transformation function to `Iterable`, which will lazily transform prop instances.
```ts
import { mapPropsIterable, TComponentConfig } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

/* create custom map function */
const transform = ({ id, props, progress }) => ({
  id,
  props,
  options: {}
})

/* iterate over props applying your transform function */
for (const { id, props, options } of mapPropsIterable(config, transform)) {
  /* ... */
}
```
## `createChildren`
>`<K>(componentConfig: TComponentConfig<any, K>, childrenMap: TChildrenMap<K>): ReactElement | ReactElement[]`

Creates React children from `ChildrenMap`.
```ts
import { createChildren, isChildrenMap, getProps, TComponentConfig } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

/* get props for specific permutation index */
const props = getProps(config, '0')

/* Check if props contains children as childrenMap */
if (isChildrenMap(props.children)) {
  /* generate React children from childrenMap */
  props.children = createChildren(config, props.children)
}
```
## `getChildrenKeys`
>`<K>(config: TComponentConfig<any, K>): K[]`

Returns children keys in correct order. To be used instead of `Object.keys`.
```ts
import { getChildrenKeys, TComponentConfig } from 'autoprops'

/* get Component config somehow */
const config: TComponentConfig

/* iterate over children keys */
for (const childKey of getChildrenKeys(config)) {
  /*  */
}
```
