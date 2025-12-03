"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "brand" | "user" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string | null;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load auth state from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const { isAuthenticated: auth, role, name } = JSON.parse(storedAuth);
          setIsAuthenticated(auth);
          setUserRole(role);
          setUserName(name);
        } catch (error) {
          console.error("Failed to parse auth data:", error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const login = (role: UserRole, name: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated: true,
        role,
        name,
      })
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
