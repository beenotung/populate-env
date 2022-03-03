# populate-env

Populate a given object from process.env with default value and types.

[![npm Package Version](https://img.shields.io/npm/v/populate-env.svg?maxAge=2592000)](https://www.npmjs.com/package/populate-env)

## Usage Example

```typescript
// using named import
import { populateEnv } from 'populate-env'

// or using default import
// import populateEnv from 'populate-env'

// with auto inferred type
export let env = {
  JWT_SECRET: '', // mandatory string variable
  HOST: '0.0.0.0', // optional string variable
  VERSION: 0, // mandatory numeric variable
  PORT: 8100, // optional numeric variable
  SOME_MORE_VAR: '',
}

populateEnv(env) // will throw error if missed

populateEnv(env, 'halt') // halt with clear error message
// print to stderr: "Missing JWT_SECRET, SOME_MORE_VAR in env"
// then auto halt with process.exit(1)
```

## Typescript Signature

```typescript
export default populateEnv

export function populateEnv(
  env: Record<string, string | number>,
  options?: PopulateEnvOptions,
): void

export type PopulateEnvOptions = {
  mode?: 'halt' | 'error' // default is 'error'
  source?: typeof process.env // default is process.env
}

export class EnvError extends Error {
  missingNames: string[]
}
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
