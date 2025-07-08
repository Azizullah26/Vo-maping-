"use client";

import { useEffect } from "react";

export default function ErrorHandler() {
  useEffect(() => {
    // More aggressive Mapbox error suppression
    const handleError = (e: ErrorEvent) => {
      // Check for any AbortError that might be from Mapbox
      if (e.error?.name === "AbortError") {
        const stack = e.error?.stack || "";
        const message = e.error?.message || "";

        // Suppress if it contains any Mapbox-related patterns
        if (
          message.includes("signal is aborted") ||
          message.includes("aborted without reason") ||
          stack.includes("mapbox-gl.js") ||
          stack.includes("mapbox") ||
          stack.includes("api.mapbox.com") ||
          stack.includes("abortTile") ||
          stack.includes("_removeTile") ||
          stack.includes("updateSources") ||
          stack.includes("Map._render")
        ) {
          console.debug("Suppressed Mapbox AbortError:", message);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      // Handle promise rejections from AbortErrors
      if (e.reason?.name === "AbortError") {
        const stack = e.reason?.stack || "";
        const message = e.reason?.message || "";

        // Suppress any AbortError that might be from Mapbox
        if (
          message.includes("signal is aborted") ||
          message.includes("aborted without reason") ||
          stack.includes("mapbox-gl.js") ||
          stack.includes("mapbox") ||
          stack.includes("api.mapbox.com") ||
          stack.includes("abortTile") ||
          stack.includes("_removeTile") ||
          stack.includes("updateSources") ||
          stack.includes("Map._render")
        ) {
          console.debug(
            "Suppressed Mapbox AbortError Promise rejection:",
            message,
          );
          e.preventDefault();
          return false;
        }
      }

      // Handle string-based rejection messages
      if (typeof e.reason === "string") {
        if (
          e.reason.includes("AbortError") ||
          e.reason.includes("mapbox") ||
          e.reason.includes("signal is aborted") ||
          e.reason.includes("abortTile")
        ) {
          console.debug("Suppressed Mapbox error string rejection:", e.reason);
          e.preventDefault();
          return false;
        }
      }
    };

    // Add console.error override for more aggressive suppression
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(" ");
      if (
        (message.includes("AbortError") &&
          (message.includes("mapbox") ||
            message.includes("signal is aborted"))) ||
        (message.includes("Failed to fetch") && message.includes("supabase")) ||
        (message.includes("TypeError: Failed to fetch") &&
          message.includes("fullstory"))
      ) {
        console.debug("Suppressed console.error for network error:", message);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Override fetch to handle Supabase connection errors gracefully
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        // Check if this is a Supabase-related fetch error
        if (
          error instanceof TypeError &&
          error.message === "Failed to fetch" &&
          args[0]?.toString().includes("supabase")
        ) {
          console.debug("Suppressed Supabase fetch error:", error);
          // Return a mock response for Supabase errors
          return new Response(
            JSON.stringify({ error: "Connection failed", data: null }),
            {
              status: 500,
              statusText: "Connection Error",
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        throw error;
      }
    };

    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleRejection, true);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection, true);
      console.error = originalConsoleError;
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
