"use client";
import { useEffect, useState, type ReactNode } from "react";
/** Mounted only in explicitly enabled development mode; gates requests until MSW is ready. */
export function MockProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"starting" | "ready" | "error">(
    "starting",
  );
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined")
      return;
    let active = true;
    import("@/mocks/browser")
      .then(({ startMocking }) => startMocking())
      .then(() => {
        if (active) setState("ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, []);
  if (state === "starting")
    return (
      <p className="section site-container" role="status">
        Starting development mocks...
      </p>
    );
  if (state === "error")
    return (
      <p className="section site-container" role="alert">
        Development mocks could not start. Check the worker setup and reload.
      </p>
    );
  return children;
}
