import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";

export function useOrganizerAccess() {
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAccess = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsOrganizer(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users/is-organizer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsOrganizer(Boolean(response.data?.data));
    } catch (err) {
      console.error("Failed to check organizer access", err);
      setIsOrganizer(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  return { isOrganizer, loading, refreshAccess: loadAccess };
}
