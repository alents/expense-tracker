"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken, setToken, removeToken } from "@/shared/api/client";
import type { UserDto } from "@expense-tracker/shared";

const USER_KEY = "auth_user";

function getStoredUser(): UserDto | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserDto) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setUser(getStoredUser());
    setIsHydrated(true);
  }, []);

  const setAuth = useCallback((newToken: string, newUser: UserDto) => {
    setToken(newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem(USER_KEY);
    setTokenState(null);
    setUser(null);
  }, []);

  return { token, user, isHydrated, setAuth, logout };
}
