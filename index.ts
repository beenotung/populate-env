export class EnvError extends Error {
  constructor(public missingNames: string[]) {
    super(`Missing ${missingNames.join(', ')} in env`)
  }
}

export function populateEnv(
  env: Record<string, string | number>,
  mode?: 'halt',
) {
  let missingNames: string[] = []
  for (let name in env) {
    let defaultValue = env[name]
    let envValue: string | number | undefined = process.env[name]

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
    if (mode === 'halt') {
      console.error(error.message)
      process.exit(1)
    }
    throw error
  }
}

export default populateEnv
