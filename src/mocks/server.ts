import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Test-only: never import this module into application routes or providers.
export const server = setupServer(...handlers);
