// Local type shim for jest-axe. We use jest-axe only at runtime (its `axe()`
// runner + `toHaveNoViolations` matcher, registered with Vitest in
// vitest.setup.ts). We deliberately do NOT depend on `@types/jest-axe`, because
// it pulls in `@types/jest`, whose global `expect`/`describe` declarations clash
// with Vitest's globals and break type-checking.
declare module 'jest-axe' {
  export function axe(
    html: Element | string,
    options?: Record<string, unknown>,
  ): Promise<unknown>;
  export const toHaveNoViolations: unknown;
}
