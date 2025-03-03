import { assertType } from './assertion/index.js'
import { JSONObject, JSONTypes } from './JSONTypes.js'
import { isType } from './predicates/index.js'

test('empty object', () => {
  assertType<JSONTypes>({})
})

test('empty array', () => {
  assertType<JSONTypes>([])
})

test('string array', () => {
  assertType<JSONTypes>(['a'])
})

test('JSONObject', () => {
  isType<JSONObject>({})
})

describe('JSONTypes.get', () => {
  test('cast to T | undefined without props', () => {
    const a = JSONTypes.get<string>('abc')
    isType<string | undefined>(a)
    expect(a).toBe('abc')
  })
  test('get object props', () => {
    const a = JSONTypes.get<string>({ a: { b: 'abc' } }, 'a', 'b')
    isType<string | undefined>(a)
    expect(a).toBe('abc')
  })

  test('get array entry', () => {
    const a = JSONTypes.get<string>(['abc'], 0)
    isType<string | undefined>(a)
    expect(a).toBe('abc')
  })
  test('nested', () => {
    const a = JSONTypes.get<string>({ a: { b: [{ c: 'abc' }] } }, 'a', 'b', 0, 'c')
    isType<string | undefined>(a)
    expect(a).toBe('abc')
  })
})
