import { expect, afterEach } from "vitest";
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// @ts-expect-error: TypeScript does not recognize the global expect, but it is set up for testing
globalThis.expect = expect;

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
