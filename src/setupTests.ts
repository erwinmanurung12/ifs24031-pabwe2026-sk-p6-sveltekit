import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("$app/navigation", () => ({ goto: vi.fn() }));
vi.mock("$app/state", () => ({
  page: { url: new URL("http://localhost/"), params: {}, status: 404, error: null },
}));
