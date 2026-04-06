"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}

interface LoginAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const expiry = localStorage.getItem("auth_expiry");
        const storedUser = localStorage.getItem("user");

        if (token && expiry) {
          const now = new Date().getTime();
          if (now < Number.parseInt(expiry)) {
            setIsAuthenticated(true);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            // Token expired, clean up
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_expiry");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setUser(null);
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

      // Call external SSO endpoint
      const ssoResponse = await fetch(
        "https://elarcehub.site/api/elrace-map/sso/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
            rememberMe,
            redirectUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/welcome`,
          }),
          credentials: "include", // Include cookies for CORS
        }
      );

      if (!ssoResponse.ok) {
        const errorData = await ssoResponse.json().catch(() => ({ message: "Login failed" }));
        setError(errorData.message || `Login failed with status ${ssoResponse.status}`);
        console.error("ELRACE Map upstream SSO endpoint returned", ssoResponse.status);
        return false;
      }

      const data = await ssoResponse.json();

      if (data.success || data.token) {
        // Store the token and user info from SSO response
        const token = data.token || btoa(`${username}:${Date.now()}`);
        const expiryTime = rememberMe
          ? new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days
          : new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_expiry", expiryTime.toString());
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          // Fallback user object if SSO doesn't return user data
          const fallbackUser: User = {
            username: username.trim(),
            name: username.trim(),
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          setUser(fallbackUser);
        }

        setIsAuthenticated(true);
        return true;
      }

      setError(data.message || "Invalid username or password");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login. Please try again.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expiry");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <LoginAuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading, error }}
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
