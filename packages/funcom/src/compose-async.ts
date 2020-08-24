export function composeAsync<A>(): (arg: A) => Promise<A>
export function composeAsync<A, B>(fn: (arg: A) => Promise<B> | B): (arg: A) => Promise<B>
export function composeAsync<A, B, C>(fn0: (arg: B) => Promise<C> | C, fn1: (arg: A) => Promise<B> | B): (arg: A) => Promise<C>
export function composeAsync<A, B, C, D>(fn0: (arg: C) => Promise<D> | D, fn1: (arg: B) => Promise<C> | C, fn2: (arg: A) => Promise<B> | B): (arg: A) => Promise<D>
export function composeAsync<A, B, C, D, E>(fn0: (arg: D) => Promise<E> | E, fn1: (arg: C) => Promise<D> | D, fn2: (arg: B) => Promise<C> | C, fn3: (arg: A) => Promise<B> | B): (arg: A) => Promise<E>
export function composeAsync<A, B, C, D, E, F>(fn0: (arg: E) => Promise<F> | F, fn1: (arg: D) => Promise<E> | E, fn2: (arg: C) => Promise<D> | D, fn3: (arg: B) => Promise<C> | C, fn4: (arg: A) => Promise<B> | B): (arg: A) => Promise<F>
export function composeAsync<A, B, C, D, E, F, G>(fn0: (arg: F) => Promise<G> | G, fn1: (arg: E) => Promise<F> | F, fn2: (arg: D) => Promise<E> | E, fn3: (arg: C) => Promise<D> | D, fn4: (arg: B) => Promise<C> | C, fn5: (arg: A) => Promise<B> | B): (arg: A) => Promise<G>
export function composeAsync<A, B, C, D, E, F, G, H>(fn0: (arg: G) => Promise<H> | H, fn1: (arg: F) => Promise<G> | G, fn2: (arg: E) => Promise<F> | F, fn3: (arg: D) => Promise<E> | E, fn4: (arg: C) => Promise<D> | D, fn5: (arg: B) => Promise<C> | C, fn6: (arg: A) => Promise<B> | B): (arg: A) => Promise<H>
export function composeAsync<A, B, C, D, E, F, G, H, I>(fn0: (arg: H) => Promise<I> | I, fn1: (arg: G) => Promise<H> | H, fn2: (arg: F) => Promise<G> | G, fn3: (arg: E) => Promise<F> | F, fn4: (arg: D) => Promise<E> | E, fn5: (arg: C) => Promise<D> | D, fn6: (arg: B) => Promise<C> | C, fn7: (arg: A) => Promise<B> | B): (arg: A) => Promise<I>

export function composeAsync(...fns: any[]) {
  return (initial: any) => fns.reduceRight(
    (arg, fn) => arg.then(fn),
    Promise.resolve(initial)
  )
}

