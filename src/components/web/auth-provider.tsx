"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access_token: string, refresh_token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        try {
          setIsAuthenticated(true);
        } catch {
          Cookies.remove("access_token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (access_token: string, refresh_token: string) => {
    Cookies.set("access_token", access_token, { expires: 7 });
    Cookies.set("refresh_token", refresh_token, { expires: 30 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("access_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
