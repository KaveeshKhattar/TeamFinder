import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Event } from "@/types";
import { BASE_URL } from "@/config";
import { getOrFetchCached, invalidateCache, setCached } from "@/lib/requestCache";

const EVENTS_CACHE_KEY = "events:list";
const EVENTS_TTL_MS = 30_000;

async function fetchEventsFromApi(): Promise<Event[]> {
  const response = await axios.get(`${BASE_URL}/api/events`);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getOrFetchCached(
        EVENTS_CACHE_KEY,
        fetchEventsFromApi,
        EVENTS_TTL_MS
      );
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchEventsFromApi();
      setCached(EVENTS_CACHE_KEY, data, EVENTS_TTL_MS);
      setEvents(data);
      return data;
    } catch (err) {
      console.error("Failed to refresh events", err);
      setError("Failed to fetch events");
      throw err;
    }
  }, []);

  const invalidateEvents = useCallback(() => {
    invalidateCache(EVENTS_CACHE_KEY);
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  return { events, loading, error, refreshEvents, invalidateEvents };
}
