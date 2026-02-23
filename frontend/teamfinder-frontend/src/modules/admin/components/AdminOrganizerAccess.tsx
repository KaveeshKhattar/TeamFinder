import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "@/modules/landingPage/components/Header";
import { BASE_URL } from "@/config";
import { useEvents } from "@/modules/core/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function AdminOrganizerAccess() {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const loadOrganizers = async (eventId: number) => {
    setPageLoading(true);
    setStatusMessage("");
    try {
      const response = await axios.get(`${BASE_URL}/admin/organizers/events/${eventId}`, authHeaders);
      setOrganizers(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to load organizers. You may not have admin access.");
      setOrganizers([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedEventId || !token) return;
    void loadOrganizers(selectedEventId);
  }, [selectedEventId, token]);

  const handleGrantOrRevoke = async (action: "grant" | "revoke") => {
    if (!selectedEventId || !userEmail.trim()) return;
    setActionLoading(true);
    setStatusMessage("");
    try {
      await axios.post(
        `${BASE_URL}/admin/organizers/${action}`,
        {
          eventId: selectedEventId,
          userEmail: userEmail.trim(),
        },
        authHeaders
      );
      setStatusMessage(
        action === "grant"
          ? `Granted organizer access to ${userEmail.trim()}.`
          : `Revoked organizer access from ${userEmail.trim()}.`
      );
      setUserEmail("");
      await loadOrganizers(selectedEventId);
    } catch (error) {
      console.error(error);
      setStatusMessage("Action failed. Check admin access, event, and user email.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background ambient-canvas">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Admin Organizer Access</h1>
        {!token && (
          <Card className="glass-card">
            <CardContent className="p-4 text-sm">
              Sign in first. This page requires an authenticated admin account.
            </CardContent>
          </Card>
        )}

        <Card className="glass-card">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event</label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm touch-target dotted-panel"
                value={selectedEventId ?? ""}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                disabled={eventsLoading || events.length === 0}
              >
                {events.length === 0 && <option value="">No events available</option>}
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} (#{event.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">User Email</label>
              <Input
                className="touch-target"
                type="email"
                placeholder="user@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="touch-target"
                disabled={actionLoading || !token || !selectedEventId || !userEmail.trim()}
                onClick={() => void handleGrantOrRevoke("grant")}
              >
                Grant Organizer
              </Button>
              <Button
                className="touch-target"
                variant="destructive"
                disabled={actionLoading || !token || !selectedEventId || !userEmail.trim()}
                onClick={() => void handleGrantOrRevoke("revoke")}
              >
                Revoke Organizer
              </Button>
              <Button
                className="touch-target"
                variant="outline"
                disabled={pageLoading || !token || !selectedEventId}
                onClick={() => selectedEventId && void loadOrganizers(selectedEventId)}
              >
                Refresh List
              </Button>
            </div>

            {statusMessage && <p className="status-chip">{statusMessage}</p>}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-medium">Current Organizers</h2>
            {pageLoading ? (
              <p className="text-sm text-muted-foreground">Loading organizers...</p>
            ) : organizers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No organizers found for this event.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-sm dotted-panel rounded-md p-3 bg-cyan-50/30 dark:bg-cyan-900/20">
                {organizers.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default AdminOrganizerAccess;
