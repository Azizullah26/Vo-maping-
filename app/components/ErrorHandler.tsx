"use client";

import { useEffect } from "react";

export default function ErrorHandler() {
  useEffect(() => {
    // Suppress Mapbox AbortErrors which are not critical
    const handleError = (e: ErrorEvent) => {
      // Check for AbortError with various message patterns
      if (
        e.error?.name === "AbortError" &&
        (e.error?.message?.includes("signal is aborted") ||
          e.error?.message?.includes("aborted") ||
          e.error?.stack?.includes("mapbox-gl.js"))
      ) {
        console.debug("Suppressed Mapbox AbortError:", e.error.message);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Also catch generic AbortErrors that might be from Mapbox
      if (
        e.error?.name === "AbortError" &&
        e.error?.stack?.includes("mapbox")
      ) {
        console.debug("Suppressed Mapbox-related AbortError:", e.error.message);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      // Handle promise rejections from AbortErrors
      if (
        e.reason?.name === "AbortError" &&
        (e.reason?.message?.includes("signal is aborted") ||
          e.reason?.message?.includes("aborted") ||
          e.reason?.stack?.includes("mapbox-gl.js"))
      ) {
        console.debug(
          "Suppressed Mapbox AbortError Promise rejection:",
          e.reason.message,
        );
        e.preventDefault();
        return false;
      }

      // Handle string-based rejection messages
      if (
        typeof e.reason === "string" &&
        e.reason.includes("AbortError") &&
        e.reason.includes("mapbox")
      ) {
        console.debug(
          "Suppressed Mapbox AbortError string rejection:",
          e.reason,
        );
        e.preventDefault();
        return false;
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
