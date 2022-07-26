type GenerateStringUnion<T> = Extract<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never;
  }[keyof T],
  string
>;

/** Removes types from T that are assignable to U */
export type Diff<T, U> = T extends U ? never : T;

/** Removes types from T that are not assignable to U */
export type Filter<T, U> = T extends U ? T : never;

/** Constructs a type by including null and undefined to Type. */
export type Nullable<T> = { [P in keyof T]: T[P] | null | undefined };

export type NotUndefined<T> = T extends undefined ? never : T;

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U;

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 */
export type OverridableStringUnion<
  T,
  U = EmptyIntersectionObject
> = GenerateStringUnion<Overwrite<T, U>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyIntersectionObject = {};

export type AnyObject = Record<string | number | symbol, unknown>;
export type EmptyObject = Record<string | number | symbol, never>;

export type MergeElementProps<
  T extends React.ElementType,
  P = EmptyIntersectionObject
> = Overwrite<React.ComponentPropsWithRef<T>, P>;

/**
 * Helps create a type where at least one of the properties of an interface is required to exist.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Diff<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Diff<Keys, K>>>;
  }[Keys];

/**
 * Helps create a type where only one of the properties of an interface is required to exist.
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Diff<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Diff<Keys, K>, undefined>>;
  }[Keys];

export type ClassesMap<Required, Optional> = Record<Required, string> &
  Partial<Record<Optional, string>>;
