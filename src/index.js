'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

const { parsers: typescriptParsers } = _interopDefault(
  require('prettier/parser-typescript')
)
const { parsers: javascriptParsers } = _interopDefault(
  require('prettier/parser-babylon')
)
const sortImports = _interopDefault(require('import-sort'))
const { getConfig } = _interopDefault(require('import-sort-config'))
const path = _interopDefault(require('path'))

function throwIf(condition, message) {
  if (condition) {
    throw new Error(`prettier-plugin-import-sort:  ${message}`)
  }
}

function getAndCheckConfig(extension, fileDirectory) {
  const resolvedConfig = getConfig(extension, fileDirectory)
  throwIf(!resolvedConfig, `No configuration found for file type ${extension}`)

  const rawParser = resolvedConfig.config.parser
  const rawStyle = resolvedConfig.config.style

  throwIf(!rawParser, `No parser defined for file type ${extension}`)
  throwIf(!rawStyle, `No style defined for file type ${extension}`)

  const { parser, style } = resolvedConfig

  throwIf(!parser, `Parser "${rawParser}" could not be resolved`)
  throwIf(
    !style || style === rawStyle,
    `Style "${rawStyle}" could not be resolved`
  )

  return resolvedConfig
}

function organizeImports(unsortedCode, filePath) {
  // this throw exceptions up to prettier
  const config = getAndCheckConfig(
    path.extname(filePath),
    path.dirname(filePath)
  )
  const { parser, style, config: rawConfig } = config
  const sortResult = sortImports(
    unsortedCode,
    parser,
    style,
    filePath,
    rawConfig.options
  )
  return sortResult.code
}

const parsers = {
  typescript: {
    ...typescriptParsers.typescript,
    preprocess(text, { filepath = 'dummy.ts' }) {
      return organizeImports(text, filepath)
    }
  },
  babel: {
    ...javascriptParsers.babel,
    preprocess(text, { filepath = 'dummy.js' }) {
      return organizeImports(text, filepath)
    }
  }
}

module.exports = {
  parsers
}
