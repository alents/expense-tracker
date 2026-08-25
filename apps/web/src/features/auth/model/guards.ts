"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authStore";

export function useRequireAuth() {
  const { token, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && token === null) {
      router.replace("/login");
    }
  }, [isHydrated, token, router]);

  return token;
}

export function useRedirectIfAuthed() {
  const { token, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && token) {
      router.replace("/");
    }
  }, [isHydrated, token, router]);
}
