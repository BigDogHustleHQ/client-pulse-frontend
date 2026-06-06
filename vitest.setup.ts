import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';

// jsdom lacks ResizeObserver, which Radix UI primitives (e.g. Checkbox via
// @radix-ui/react-use-size) rely on at mount.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jest-axe ships a matcher + the `axe()` runner; the runner is framework
// agnostic, but the matcher must be registered with Vitest's expect. Unit
// tests (jsdom project) assert `expect(await axe(el)).toHaveNoViolations()`.
// `toHaveNoViolations` is typed as `unknown` by our local shim (jest-axe.d.ts),
// so cast it to expect.extend's matchers-object parameter.
expect.extend(toHaveNoViolations as Parameters<typeof expect.extend>[0]);

declare module 'vitest' {
  // Type params must match the other `Assertion` declarations (Vitest +
  // jest-dom both use `<T = any>`), or TS errors on mismatched defaults.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
