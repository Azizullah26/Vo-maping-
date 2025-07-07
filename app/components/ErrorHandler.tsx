"use client";

import { useEffect } from "react";

export default function ErrorHandler() {
  useEffect(() => {
    // Suppress Mapbox AbortErrors which are not critical
    const handleError = (e: ErrorEvent) => {
      if (
        e.error?.name === "AbortError" &&
        e.error?.message?.includes("signal is aborted")
      ) {
        console.debug("Suppressed Mapbox AbortError:", e.error.message);
        e.preventDefault();
        return false;
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason?.name === "AbortError" &&
        e.reason?.message?.includes("signal is aborted")
      ) {
        console.debug(
          "Suppressed Mapbox AbortError Promise rejection:",
          e.reason.message,
        );
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
