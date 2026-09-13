"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getToken, setToken, removeToken } from "@/shared/api/client";
import type { UserDto } from "@expense-tracker/shared";

const USER_KEY = "auth_user";

interface AuthState {
  token: string | null;
  user: UserDto | null;
  isHydrated: boolean;
}

function getStoredUser(): UserDto | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserDto) : null;
  } catch {
    return null;
  }
}

let state: AuthState = { token: null, user: null, isHydrated: false };
const listeners = new Set<() => void>();

function setState(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot(): AuthState {
  return { token: null, user: null, isHydrated: false };
}

if (typeof window !== "undefined") {
  state = { token: getToken(), user: getStoredUser(), isHydrated: true };
}

export function useAuth() {
  const { token, user, isHydrated } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setAuth = useCallback((newToken: string, newUser: UserDto) => {
    setToken(newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setState({ token: newToken, user: newUser });
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem(USER_KEY);
    setState({ token: null, user: null });
  }, []);

  return { token, user, isHydrated, setAuth, logout };
}
