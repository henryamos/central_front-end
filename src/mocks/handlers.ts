import { http, HttpResponse } from "msw/http";
import { foundationStatus } from "./foundation";
export const handlers = [
  http.get("*/api/v1/_foundation/status", () =>
    HttpResponse.json(foundationStatus),
  ),
  // Unknown development API requests must not fall through to a real service.
  http.all("*/api/*", () =>
    HttpResponse.json(
      { message: "No development mock is defined for this endpoint." },
      { status: 501 },
    ),
  ),
];
