import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";
import { User } from "@/types";
import { getOrFetchCached, invalidateCache, setCached } from "@/lib/requestCache";

const PROFILE_TTL_MS = 30_000;

async function fetchProfile(token: string): Promise<User> {
  const response = await axios.get(`${BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data as User;
}

export function useCurrentUser() {
  const token = localStorage.getItem("token");
  const cacheKey = useMemo(
    () => (token ? `user:profile:${token.slice(-12)}` : ""),
    [token]
  );

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!token || !cacheKey) {
      setUser(null);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await getOrFetchCached(
        cacheKey,
        () => fetchProfile(token),
        PROFILE_TTL_MS
      );
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, [cacheKey, token]);

  const refreshUser = useCallback(async () => {
    if (!token || !cacheKey) {
      setUser(null);
      return null;
    }

    setError(null);
    const data = await fetchProfile(token);
    setCached(cacheKey, data, PROFILE_TTL_MS);
    setUser(data);
    return data;
  }, [cacheKey, token]);

  const invalidateUser = useCallback(() => {
    if (cacheKey) {
      invalidateCache(cacheKey);
    }
  }, [cacheKey]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return { user, loading, error, refreshUser, invalidateUser };
}
