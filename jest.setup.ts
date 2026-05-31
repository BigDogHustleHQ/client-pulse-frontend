import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// jsdom lacks ResizeObserver, which Radix UI primitives (e.g. Checkbox) rely on.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
