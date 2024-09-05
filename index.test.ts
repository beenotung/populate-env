import { expect } from 'chai'
import populateEnv, { saveEnv } from './index'
import { config } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'

it('should raise error when missing numeric variable', () => {
  let env = {
    MIN_PAY: NaN, // mandatory numeric variable
    VERSION: 0, // optional numeric variable
  }

  expect(() => populateEnv(env, { mode: 'error', source: {} })).to.throw(
    /^Missing MIN_PAY in env$/,
  )

  expect(env).deep.equals({
    MIN_PAY: NaN,
    VERSION: 0,
  })
})

it('should raise error when missing string variable', () => {
  let env = {
    JWT_SECRET: '', // mandatory string variable
    HOST: '0.0.0.0', // optional string variable
  }

  expect(() => populateEnv(env, { mode: 'error', source: {} })).to.throw(
    /^Missing JWT_SECRET in env$/,
  )

  expect(env).deep.equals({
    JWT_SECRET: '',
    HOST: '0.0.0.0',
  })
})

describe('boolean', () => {
  it('should not overwrite false boolean variable', () => {
    let env = {
      AUTO_SAVE: true,
      AUTO_LOGIN: false,
    }

    populateEnv(env, {
      mode: 'error',
      source: {
        AUTO_SAVE: 'false',
        AUTO_LOGIN: 'true',
      },
    })

    expect(env).deep.equals({
      AUTO_SAVE: false,
      AUTO_LOGIN: true,
    })
  })

  it('should recognize alternative boolean values', () => {
    let env = {
      t1: false,
      t2: false,
      t3: false,
      t4: false,
      f1: true,
      f2: true,
      f3: true,
      f4: true,
    }

    populateEnv(env, {
      mode: 'error',
      source: {
        t1: 'true',
        f1: 'false',
        t2: 'on',
        f2: 'off',
        t3: 'enable',
        f3: 'disable',
        t4: 'enabled',
        f4: 'disabled',
      },
    })

    expect(env).deep.equals({
      t1: true,
      t2: true,
      t3: true,
      t4: true,
      f1: false,
      f2: false,
      f3: false,
      f4: false,
    })
  })
})

it('should load from env and save to file', () => {
  process.env.JWT_SECRET = '1'
  process.env.SOME_MORE_VAR = '2'
  writeFileSync(
    '.env',
    `
HOST=0.0.0.0
PORT=8100
VERSION=0
`.trim() + '\n',
  )

  config()

  let env = {
    JWT_SECRET: '', // mandatory string variable
    HOST: '0.0.0.0', // optional string variable
    VERSION: NaN, // mandatory numeric variable
    PORT: 8100, // optional numeric variable
    SOME_MORE_VAR: '',
    SCROLL_IN_DETAIL: true, // optional boolean variable
    AUTO_SAVE: false, // optional boolean variable
  }

  populateEnv(env, { mode: 'error' })

  expect(env).deep.equals({
    JWT_SECRET: '1',
    HOST: '0.0.0.0',
    VERSION: 0,
    PORT: 8100,
    SOME_MORE_VAR: '2',
    SCROLL_IN_DETAIL: true,
    AUTO_SAVE: false,
  })

  saveEnv({ env })
  expect(readFileSync('.env').toString()).to.equals(
    `
HOST=0.0.0.0
PORT=8100
VERSION=0
JWT_SECRET=1
SOME_MORE_VAR=2
SCROLL_IN_DETAIL=true
AUTO_SAVE=false
`.trim() + '\n',
  )
})

it('should halt when missing variables', () => {})
