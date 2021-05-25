# prettier-plugin-import-sort

This is [Prettier] plugin to sort imports using [import-sort] for javascript and typescript files.

[Prettier]: https://github.com/prettier/prettier
[import-sort]: https://github.com/renke/import-sort

## Installation

```bash
$ npm i -D prettier prettier-plugin-import-sort
```

You will also want to install an import sort style module of your choice, such as: 

```bash
$ npm i -D import-sort-style-module
```

You will then need the configuration for import-sorts available, e.g. something like this in package.json

```json
"importSort": {
    ".js, .jsx, .ts, .tsx": {
      "style": "module"
    }
  }
```

If you are using typescript, you may also need to specify the typescript parser.  This is somewhat dependant upon the typescript features used (decorators for instance), e.g.

```json
"importSort": {
    ".js, .jsx, .ts, .tsx": {
      "style": "module",
      "parser": "typescript"
    }
  }
```

Note: importSort silently falls back to its default configuration if it finds a setup error. Make sure that the extension list is like the example above and not something like `"*.js"` which is an error.


### Credits:

A large part of this code was copied from import-sort-cli.
