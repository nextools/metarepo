<p align="center">
  <img src="logo.svg" width="320" height="320"/>
</p>

<p align="center">
  <a href="https://travis-ci.org/bubble-dev/_"><img src="https://flat.badgen.net/travis/bubble-dev/_/master?label=tests"/></a>  <a href="https://codecov.io/github/bubble-dev/_"><img src="https://flat.badgen.net/codecov/c/github/bubble-dev/_/master"/></a>
</p>

> But what is a _Metarepo_? Isn't this just a monorepo? And if so, why are there so many unrelated packages here?

The _Metarepo_ is a new concept that we are trying out to simplify the development process. Many of the projects are dependencies of each other, so we can iterate in all at the same time. `@auto` tools, one of the set of libraries that we developed here, allows us to do automatic dependency management. For example, `@auto` will find out the dependents of a package that was updated, and update them in turn. This kind of thing works more smoothly when sharing repositories, so we opted for having all in the same place.

So far, the _Metarepo_ is working really well for us, but we are aware it might present a bit a learning curve. The upshot is that you don't have to worry about a project being moved in here, projects placed in here are the same as before and are being actively worked on, the reason they are being moved here is simpler logistics.

# Bubble Dev Metarepo

This repository is a collection of JavaScript libraries, grouped in the same place for the best developer experience. Check the individual documentations for more details:

- [@auto](packages/auto): Set of helpers for managing and developing monorepos.
- [codecov-lite](packages/codecov-lite): LCOV (code coverage data) uploader for codecov.io service.
- [copie](packages/copie): Copy a file.
- [dleet](packages/dleet): Delete directories and files.
- [elegir](packages/elegir): Switch-like expressions that look good.
- [ekst](packages/ekst): Append, prepend, replace or remove basename extensions.
- [@fantasy-color](packages/fantasy-color): 🌈 Color manipulation functions for JavaScript.
- [mocku](packages/mocku): Mocking library.
- [move-path](packages/move-path): Move path to destination folder.
- [pifs](packages/pifs): Promisified graceful-fs.
- [refun](packages/refun): React Hook-enabled functions that compose harmoniously with each other.
- [@start](packages/start): Functional, fast and shareable task runner.
- [spyfn](packages/spyfn): Spy function.
- [typeon](packages/typeon): Typed JSON parse and stringify for TypeScript.
