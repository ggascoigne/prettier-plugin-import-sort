'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

const { parsers: typescriptParsers } = _interopDefault(require('prettier/parser-typescript'))
const { parsers: javascriptParsers } = _interopDefault(require('prettier/parser-babylon'))
const sortImports = _interopDefault(require('import-sort'))
const { getConfig } = _interopDefault(require('import-sort-config'))
const path = _interopDefault(require('path'))

function throwIf(condition, message) {
  if (condition) {
    throw new Error(message)
  }
}

function handleFilePathError(filePath, e) {
  console.error(`${filePath}:`)
  console.error(e.toString())
  process.exitCode = 2
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
  throwIf(!style, `Style "${rawStyle}" could not be resolved`)

  return resolvedConfig
}

function organizeImports(unsortedCode, filePath) {
  let config

  try {
    config = getAndCheckConfig(path.extname(filePath), path.dirname(filePath))
  } catch (e) {
    handleFilePathError(filePath, e)
  }

  const { parser, style, config: rawConfig } = config
  let sortResult

  try {
    sortResult = sortImports(unsortedCode, parser, style, filePath, rawConfig.options)
  } catch (e) {
    handleFilePathError(filePath, e)
  }

  return sortResult.code
}

const parsers = {
  typescript: {
    ...typescriptParsers.typescript,
    preprocess(text, { filepath }) {
      return organizeImports(text, filepath)
    }
  },
  babel: {
    ...javascriptParsers.babel,
    preprocess(text, { filepath }) {
      return organizeImports(text, filepath)
    }
  }
}

module.exports = {
  parsers
}
