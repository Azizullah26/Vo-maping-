"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface LoginAuthContextType {
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const LoginAuthContext = createContext<LoginAuthContextType | undefined>(
  undefined,
);

interface LoginAuthProviderProps {
  children: ReactNode;
}

export function LoginAuthProvider({ children }: LoginAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if localStorage is available
        if (typeof window === 'undefined') {
          console.log("[v0] Server-side render, skipping auth check");
          setIsLoading(false);
          return;
        }

        const token = localStorage?.getItem("auth_token");
        const expiry = localStorage?.getItem("auth_expiry");

        console.log("[v0] Auth check - Token exists:", !!token, "Expiry exists:", !!expiry);

        if (token && expiry) {
          const now = new Date().getTime();
          if (now < Number.parseInt(expiry)) {
            console.log("[v0] Token valid, setting authenticated");
            setIsAuthenticated(true);
          } else {
            // Token expired, clean up
            console.log("[v0] Token expired, clearing");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_expiry");
            setIsAuthenticated(false);
          }
        } else {
          console.log("[v0] No token found, not authenticated");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("[v0] Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe = false,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("[v0] Login attempt for username:", username);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials
      if (username.trim() === "elrace" && password === "Elrace1122") {
        console.log("[v0] Login successful");
        // Generate a simple token
        const token = btoa(`${username}:${Date.now()}`);
        const expiryTime = rememberMe
          ? new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days
          : new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_expiry", expiryTime.toString());

        setIsAuthenticated(true);
        return true;
      }

      console.log("[v0] Invalid credentials");
      setError("Invalid username or password");
      return false;
    } catch (error) {
      console.error("[v0] Login error:", error);
      setError("An error occurred during login. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expiry");
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("[v0] Logout error:", error);
    }
  };

  return (
    <LoginAuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading, error }}
    >
      {children}
    </LoginAuthContext.Provider>
  );
}

export function useLoginAuth() {
  const context = useContext(LoginAuthContext);
  if (context === undefined) {
    throw new Error("useLoginAuth must be used within a LoginAuthProvider");
  }
  return context;
}
