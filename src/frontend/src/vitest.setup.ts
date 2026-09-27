import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// React Testing Library does not auto-clean when Vitest globals are enabled
// without the RTL auto-cleanup entry point, so unmount between tests.
afterEach(() => {
  cleanup();
});
