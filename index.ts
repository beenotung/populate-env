export class EnvError extends Error {
  constructor(public missingNames: string[]) {
    super(`Missing ${missingNames.join(', ')} in env`)
  }
}

export type PopulateEnvOptions = {
  mode?: 'halt' | 'error' // default is 'error'
  source?: typeof process.env // default is process.env
}

export function populateEnv(
  env: Record<string, string | number>,
  options?: PopulateEnvOptions,
) {
  let source = options?.source || process.env
  let missingNames: string[] = []
  for (let name in env) {
    let defaultValue = env[name]
    let envValue: string | number | undefined = source[name]

    if (envValue && typeof defaultValue === 'number') {
      envValue = +envValue
    }

    let value = envValue || defaultValue

    if (!value && value !== 0) {
      missingNames.push(name)
    } else {
      env[name] = value
    }
  }
  if (missingNames.length > 0) {
    let error = new EnvError(missingNames)
    if (options?.mode === 'halt') {
      console.error(error.message)
      process.exit(1)
    }
    throw error
  }
}

export function saveEnv(options: {
  env: object
  /** @default '.env' */
  file?: string
}) {
  let { readFileSync, writeFileSync } = require('fs')
  let file = options.file || '.env'
  let text = ''
  try {
    text = readFileSync(file).toString()
  } catch (error) {
    // file not found
  }

  let lines = text
    .trim()
    .split('\n')
    .map(line => line.trim())

  for (let [key, value] of Object.entries(options.env)) {
    value = String(value)
    let line = value.includes(' ')
      ? value.includes('"')
        ? value.includes("'")
          ? `${key}=${JSON.stringify(value)}`
          : `${key}='${value}'`
        : `${key}="${value}"`
      : `${key}=${value}`
    if (!lines.includes(line)) {
      lines.push(line)
    }
  }

  let newText = lines.join('\n') + '\n'

  if (newText != text) {
    writeFileSync(file, newText)
  }
}

export default populateEnv
