---
paths:
  - '**/*.test.{ts,tsx}'
---

# Assertion style

## `toEqual` vs `toBe`

Prefer `toEqual` over `toBe` for any non-primitive assertion (objects, arrays,
DOM-derived values). `toBe` is fine for true primitives (numbers, strings,
booleans, null, undefined) where reference equality = value equality.

Applies to all `*.test.{ts,tsx}` files.

### Rationale

`toBe` uses `Object.is` (reference equality). For objects and arrays it will
pass only if the value is the exact same reference — not if the shape matches.
`toEqual` does a deep recursive comparison, which is almost always what you want
when the expected value is an object or array literal.

### Examples

```ts
// WRONG — will fail if the object is a different reference with the same shape
expect(result).toBe({ id: 1, name: 'Alice' });

// CORRECT — deep equality
expect(result).toEqual({ id: 1, name: 'Alice' });

// Fine — primitives have no reference identity issues
expect(count).toBe(0);
expect(flag).toBe(true);
expect(label).toBe('hello');
expect(value).toBe(null);
expect(value).toBe(undefined);
```
