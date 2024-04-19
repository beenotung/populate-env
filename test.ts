import populateEnv, { saveEnv } from './index'
import { config } from 'dotenv'

config()

let env = {
  JWT_SECRET: '', // mandatory string variable
  HOST: '0.0.0.0', // optional string variable
  VERSION: 0, // mandatory numeric variable
  PORT: 8100, // optional numeric variable
  SOME_MORE_VAR: '',
}

populateEnv(env, { mode: 'halt' })

saveEnv({ env })
