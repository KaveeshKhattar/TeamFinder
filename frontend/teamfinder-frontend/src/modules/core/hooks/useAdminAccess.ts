import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";

export function useAdminAccess() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAccess = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users/is-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(Boolean(response.data?.data));
    } catch (err) {
      console.error("Failed to check admin access", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  return { isAdmin, loading, refreshAccess: loadAccess };
}
