import { CanAssign, EitherOrBoth, isType } from '../index.js'

describe('Either<A, B>', () => {
  type A = {
    a: number,
    x?: string
  }
  type B = {
    b: number,
    x?: boolean
  }
  type C = {
    c: number,
    y?: boolean
  }
  type D = {
    d: number,
    z?: number
  }
  it('allows just A', () => {
    type S = EitherOrBoth<A, B>
    isType.equal<true, true, CanAssign<{ a: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, x?: string }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, x: string }, S>>()
    isType.equal<true, false, CanAssign<{ a: number, x: number }, S>>()
  })
  it('allows just B', () => {
    type S = EitherOrBoth<A, B>
    isType.equal<true, true, CanAssign<{ b: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number, x?: boolean }, S>>()
    isType.equal<true, true, CanAssign<{ b: number, x: boolean }, S>>()
    isType.equal<true, false, CanAssign<{ b: number, x: number }, S>>()
  })
  it('allows A & B', () => {
    type S = EitherOrBoth<A, B>
    isType.equal<true, true, CanAssign<{ a: number, b: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, x?: boolean }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, x: boolean }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, x?: string }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, x: string }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, x?: string | boolean }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, x: string | boolean }, S>>()
    isType.equal<true, false, CanAssign<{ a: number, b: number, x: number }, S>>()
  })
  it('can use isType() to type guard the value', () => {
    type S = EitherOrBoth<A, B>
    function foo(o: S) {
      if (isType<A>(o, o => typeof o.a === 'number')) {
        isType.equal<true, A, typeof o>()
      }
      else {
        throw new Error('should not reach')
      }
    }
    foo({ a: 1 })
  })
  it('will make sure required field to be filled in when specifying optional field', () => {
    type S = EitherOrBoth<A, C>

    isType.equal<true, false, CanAssign<{ x: 'x' }, S>>()
    isType.equal<true, true, CanAssign<{ a: 1, x: 'x' }, S>>()
  })
  it('allows A, B, C', () => {
    type S = EitherOrBoth<A, B, C>
    isType.equal<true, true, CanAssign<{ a: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number }, S>>()
    isType.equal<true, true, CanAssign<{ c: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, c: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, c: number, x: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number, c: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, c: number }, S>>()
  })
  it('allows A, B, C, D', () => {
    type S = EitherOrBoth<A, B, C, D>
    isType.equal<true, true, CanAssign<{ a: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number }, S>>()
    isType.equal<true, true, CanAssign<{ c: number }, S>>()
    isType.equal<true, true, CanAssign<{ d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, c: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number, c: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ c: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, c: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, c: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ b: number, c: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, c: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: string, b: number, c: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: string, c: number, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, c: string, d: number }, S>>()
    isType.equal<true, true, CanAssign<{ a: number, b: number, c: number, d: string }, S>>()
  })
  it('can compose', () => {
    //  A | B | (A & B) | C | ((A | B | (A & B)) & C)
    //= A | B | C | (A & B) | ((A | B | (A & B)) & C)
    //= A | B | C | (A & B) | (A & C) | (B & C) | (A & B & C)
    type AB_C = EitherOrBoth<EitherOrBoth<A, B>, C>
    // A | B | C | (B & C) | (A & (B | C | (B & C)))
    //= A | B | C | (B & C) | (A & (B | C | (B & C)))
    //= A | B | C | (B & C) | (A & B) | (A & C) | (A & B & C)
    //= A | B | C | (A & B) | (A & C) | (B & C) | (A & B & C)
    type A_BC = EitherOrBoth<A, EitherOrBoth<B, C>>

    // A | B | (A & B) | C | (A & C) | (B & C) | (A & B & C)
    //= A | B | C | (A & B) | (A & C) | (B & C) | (A & B & C)
    type ABC = EitherOrBoth<A, B, C>

    // A | B | (A & B) | C | D | (C & D) | ((A | B | (A & B)) & (C | D | (C & D)))
    //= A | B | C | D | (A & B) | (C & D) | ((A | B | (A & B)) & (C | D | (C & D)))
    //= A | B | C | D | (A & B) | (C & D) | (((A | B | (A & B)) & C) | ((A | B | (A & B)) & D) | ((A | B | (A & B)) & (C & D))
    //= A | B | C | D | (A & B) | (C & D) | (A & C) | (B & C) | (A & B & C) | (A & D) | (B & D) | (A & B & D) | (A & C & D) | (B & C & D) | (A & B & C & D)
    //= A | B | C | D | (A & B) | (A & C) | (A & D) | (B & C) | (B & D) | (C & D) | (A & B & C) | (A & B & D) | (A & C & D) | (B & C & D) | (A & B & C & D)
    type AB_CD = EitherOrBoth<EitherOrBoth<A, B>, EitherOrBoth<C, D>>

    // A | B | C | D | (B & C) | (B & D) | (C & D) | (B & C & D) | (A & (B | C | D | (B & C) | (B & D) | (C & D) | (B & C & D)))
    //= A | B | C | D | (B & C) | (B & D) | (C & D) | (B & C & D) | (A & B) | (A & C) | (A & D) | (A & B & C) | (A & B & D) | (A & C & D) | (A & B & C & D)
    //= A | B | C | D | (A & B) | (A & C) | (A & D) | (B & C) | (B & D) | (C & D) | (A & B & C) | (A & B & D) | (A & C & D) | (B & C & D) | (A & B & C & D)
    type A_BCD = EitherOrBoth<A, EitherOrBoth<B, C, D>>

    // A | B | (A & B) | C | D | (A & C) | (B & C) | (A & B & C) | ((A | B | (A & B) | C | (A & C) | (B & C) | (A & B & C)) & D)
    //= A | B | (A & B) | C | D | (A & C) | (B & C) | (A & B & C) | (A & D) | (B & D) | (A & B & D) | (C & D) | (A & C & D) | (B & C & D) | (A & B & C & D)
    //= A | B | C | D | (A & B) | (A & C) | (A & D) | (B & C) | (B & D) | (C & D) | (A & B & C) | (A & B & D) | (A & C & D) | (B & C & D) | (A & B & C & D)
    type ABC_D = EitherOrBoth<EitherOrBoth<A, B, C>, D>

    //  A | B | C | D | (A & B) | (A & C) | (A & D) | (B & C) | (B & D) | (C & D) | (A & B & C) | (A & B & D) | (A & C & D) | (B & C & D) | (A & B & C & D)
    type ABCD = EitherOrBoth<A, B, C, D>

    isType.equal<true, ABC, A_BC>()
    isType.equal<true, ABC, AB_C>()
    isType.equal<true, ABCD, A_BCD>()
    isType.equal<true, ABCD, AB_CD>()
    isType.equal<true, ABCD, ABC_D>()
  })

  it('can be assigned as in-generics as function/promise return type', () => {
    function config(_: EitherOrBoth<A, B, C, D>) { }

    config({ a: 1 })

    function configF(_: () => EitherOrBoth<A, B, C, D>) { }
    configF(() => ({ a: 1 }))

    function configP(_: () => Promise<EitherOrBoth<A, B, C, D>>) { }

    configP(() => Promise.resolve({ a: 1 }))
  })
})
