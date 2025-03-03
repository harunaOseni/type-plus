/**
 * filter the array or tuple `A`, keeping entries satisfying `Criteria`.
 * @deprecated renaming to `KeepMatch`
 */
export type Filter<A extends Array<any>, Criteria> =
  number extends A['length']
  // array
  ? (A[0] extends Criteria
    ? A
    : (Criteria extends A[0] ? Array<Criteria> : never[])
  )
  // tuple
  : (A['length'] extends 0
    ? never
    : (A extends [infer Head, ...infer Tail]
      ? (Tail['length'] extends 0
        ? (Head extends Criteria ? [Head] : never[])
        : (Head extends Criteria
          ? [Head, ...Filter<Tail, Criteria>]
          : Filter<Tail, Criteria>))
      : never))

/**
 * keeps entries satisfying `Criteria` in array or tuple `A`.
 */
export type KeepMatch<A extends Array<any>, Criteria> = Filter<A, Criteria>
