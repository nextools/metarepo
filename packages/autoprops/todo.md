Changes:

- [ ] `applyPropValue`: rename to `getIdFor`
- [ ] `getIdFor`: add documentation explaining what happens if the arguments passed in are not valid
- [ ] `mapPropsIterable`: add explanation of what `progress` does (it goes from 0.00 to 100.00)
- [ ] `mapPropsIterable`: in the transformation function argument, rename `id` to `propsHash`
- [ ] `mapPropsIterable`: update to _not_ do `createChildren` on the children maps
- [ ] `getPropsIterable`: update to _not_ do `createChildren` on the children maps
- [ ] `transformCreateChildren`: (or some other name) create default transformation to be used instead of the old `getPropsIterable`
  ```typescript
  import { getPropsIterable } from 'autoprops'

  for (const { props } of getPropsIterable(config)) {
    console.log(props)
  }
  ```

  is replaced by:
  ```typescript
  import { mapPropsIterable, transformCreateChildren  } from 'autoprops'

  for (const { props } of mapPropsIterable(config, transformCreateChildren)) {
    console.log(props)
  }
  ```
- [ ] `ChildrenMap`: this explanation might not be needed once the default is that children do not get created. If not needed anymore, remove it, or change it to just documentation for the type of the object returned by `getPropsIterable` under the `children` key.
- [ ] `getChildrenKeys`: remove it. ordering will be opaque to consumers so there's no need to provide a function to reproduce the same internal ordering
- [ ] `Permutation Index`: rename to `Permutation Id`. add a blockquote explaining that ids are opaque, they are internally listed but that's irrelevant to the user. this is because mutexes, mutins and required are processsed when evaluating the "next" index, so not all indexes in the range are valid, that the strings are used because of compression, and for that we are using all url-safe characters. it's essentially base "all the characters" (letters upper and lower plus numbers and allowed special characters)
underneath is a big int, but we don't expose this to the user

Example:

- [ ] come up with a representative use case
- [ ] for each step, provide a codesandbox example of the use case
- [ ] illustrate a basic version of the use case, with a table showing the variations generated
- [ ] illustrate what happens to the generated variations once a required is added
- [ ] illustrate what happens to the generated variations once a mutex is added
- [ ] illustrate what happens to the generated variations once a mutin is added
- [ ] show how to use `createChildren` to render the children
- [ ] show how to use `mapPropsIterable` together with the `transformCreateChildren`
- [ ] explain how the list of examples could get unmanageably large, and how because of that, all iteration functions need to be iterators
- [ ] show how iterables are integrated into JavaScript natively with:
  ```typescript
  [...getPropsIterable(config)]
  for (let x of getPropsIterable(config)) {}
  Array.of(getPropsIterable(config))
  ```
