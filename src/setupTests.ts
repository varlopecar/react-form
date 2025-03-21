// src/setupTests.ts
import { expect } from "vitest";
import "@testing-library/jest-dom";

// @ts-expect-error: TypeScript does not recognize the global expect, but it is set up for testing
globalThis.expect = expect;
