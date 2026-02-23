import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "@/modules/landingPage/components/Header";
import { BASE_URL } from "@/config";
import { useEvents } from "@/modules/core/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Event, Team, User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TeamOpenSpot = {
  teamId: number;
  teamName: string;
  memberCount: number;
  openSpots: number;
};

type Metrics = {
  eventId: number;
  unmatchedParticipants: number;
  matchedParticipants: number;
  matchesMade: number;
  dropOffCount: number;
  dropOffRate: number;
  averageTimeToMatchHours: number | null;
  timeToMatchNote: string;
  openSpotsByTeam: TeamOpenSpot[];
};

type JoinRequest = {
  teamId: number;
  teamName: string;
  userId: number;
  userEmail: string;
  firstName: string;
  lastName: string;
};

function OrganizerDashboard() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [targetTeamSize, setTargetTeamSize] = useState("4");

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [participantsFile, setParticipantsFile] = useState<File | null>(null);
  const [teamsFile, setTeamsFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [pageLoading, setPageLoading] = useState(false);

  const [editTeamId, setEditTeamId] = useState<string>("");
  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamMemberIds, setEditTeamMemberIds] = useState("");

  const [mergeFromTeamId, setMergeFromTeamId] = useState("");
  const [mergeToTeamId, setMergeToTeamId] = useState("");

  const [splitTeamId, setSplitTeamId] = useState("");
  const [splitTeamName, setSplitTeamName] = useState("");
  const [splitMemberIds, setSplitMemberIds] = useState("");

  const token = localStorage.getItem("token");
  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadMetrics = async (eventId: number) => {
    const parsedTeamSize = Number(targetTeamSize) > 0 ? Number(targetTeamSize) : 4;
    const res = await axios.get(`${BASE_URL}/api/organizer/events/${eventId}/metrics`, {
      ...authHeaders,
      params: { targetTeamSize: parsedTeamSize },
    });
    setMetrics(res.data.data);
  };

  const loadTeams = async (eventId: number) => {
    const res = await axios.get(`${BASE_URL}/api/events/${eventId}/teams`, authHeaders);
    setTeams(Array.isArray(res.data) ? res.data : []);
  };

  const loadJoinRequests = async (eventId: number) => {
    const res = await axios.get(`${BASE_URL}/api/organizer/events/${eventId}/join-requests`, authHeaders);
    setJoinRequests(Array.isArray(res.data.data) ? res.data.data : []);
  };

  const loadAllUsers = async () => {
    const res = await axios.get(`${BASE_URL}/users/all-users`, authHeaders);
    setAllUsers(Array.isArray(res.data.data) ? res.data.data : []);
  };

  const refreshAll = async () => {
    if (!selectedEventId) return;
    setPageLoading(true);
    try {
      await Promise.all([
        loadMetrics(selectedEventId),
        loadTeams(selectedEventId),
        loadJoinRequests(selectedEventId),
        loadAllUsers(),
      ]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedEventId) return;
    refreshAll().catch((err) => {
      console.error(err);
      setStatusMessage("Failed to load organizer data.");
    });
  }, [selectedEventId]);

  const uploadParticipantsCsv = async () => {
    if (!selectedEventId || !participantsFile) return;
    const formData = new FormData();
    formData.append("file", participantsFile);
    const res = await axios.post(
      `${BASE_URL}/api/organizer/events/${selectedEventId}/import/participants`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setStatusMessage(`Participants import complete. Processed: ${res.data.data.processedRows}`);
    await refreshAll();
  };

  const uploadTeamsCsv = async () => {
    if (!selectedEventId || !teamsFile) return;
    const formData = new FormData();
    formData.append("file", teamsFile);
    const res = await axios.post(
      `${BASE_URL}/api/organizer/events/${selectedEventId}/import/teams`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setStatusMessage(`Teams import complete. Created: ${res.data.data.createdTeams}`);
    await refreshAll();
  };

  const approveRequest = async (teamId: number, userId: number) => {
    await axios.post(
      `${BASE_URL}/api/organizer/teams/${teamId}/join-requests/${userId}/approve`,
      {},
      authHeaders
    );
    setStatusMessage("Join request approved.");
    await refreshAll();
  };

  const rejectRequest = async (teamId: number, userId: number) => {
    await axios.post(
      `${BASE_URL}/api/organizer/teams/${teamId}/join-requests/${userId}/reject`,
      {},
      authHeaders
    );
    setStatusMessage("Join request rejected.");
    await refreshAll();
  };

  const submitTeamEdit = async () => {
    if (!editTeamId) return;
    const parsedUserIds = editTeamMemberIds
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isFinite(id) && id > 0);

    await axios.put(
      `${BASE_URL}/api/organizer/teams/${editTeamId}`,
      {
        teamName: editTeamName,
        userIds: parsedUserIds,
      },
      authHeaders
    );
    setStatusMessage("Team updated.");
    await refreshAll();
  };

  const submitMergeTeams = async () => {
    if (!mergeFromTeamId || !mergeToTeamId) return;
    await axios.post(
      `${BASE_URL}/api/organizer/teams/merge`,
      {
        fromTeamId: Number(mergeFromTeamId),
        toTeamId: Number(mergeToTeamId),
      },
      authHeaders
    );
    setStatusMessage("Teams merged.");
    await refreshAll();
  };

  const submitSplitTeam = async () => {
    if (!splitTeamId || !splitTeamName) return;
    const parsedUserIds = splitMemberIds
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isFinite(id) && id > 0);

    await axios.post(
      `${BASE_URL}/api/organizer/teams/${splitTeamId}/split`,
      {
        newTeamName: splitTeamName,
        userIdsToMove: parsedUserIds,
      },
      authHeaders
    );
    setStatusMessage("Team split complete.");
    await refreshAll();
  };

  const exportTeamSheet = async () => {
    if (!selectedEventId) return;
    const response = await axios.get(`${BASE_URL}/api/organizer/events/${selectedEventId}/export-team-sheet`, {
      ...authHeaders,
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `event-${selectedEventId}-teams.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Team sheet exported.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="border border-border rounded-md px-3 py-2 bg-background"
            value={selectedEventId ?? ""}
            onChange={(e) => setSelectedEventId(Number(e.target.value))}
          >
            {events.map((event: Event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            min={1}
            value={targetTeamSize}
            onChange={(e) => setTargetTeamSize(e.target.value)}
            placeholder="Target team size"
            className="max-w-[180px]"
          />
          <Button onClick={() => selectedEventId && refreshAll()}>Refresh</Button>
          <Button variant="outline" onClick={exportTeamSheet}>Export Final Team Sheet</Button>
        </div>

        {selectedEvent && (
          <p className="text-sm text-muted-foreground">
            Managing event: <span className="font-medium text-foreground">{selectedEvent.name}</span>
          </p>
        )}

        {statusMessage && <p className="text-sm">{statusMessage}</p>}

        {pageLoading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 fade-in-soft">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 fade-in-soft">
            <MetricCard title="Unmatched" value={metrics?.unmatchedParticipants ?? 0} />
            <MetricCard title="Matched" value={metrics?.matchedParticipants ?? 0} />
            <MetricCard title="Matches Made" value={metrics?.matchesMade ?? 0} />
            <MetricCard
              title="Drop-off"
              value={metrics ? `${(metrics.dropOffRate * 100).toFixed(1)}%` : "0%"}
              infoText="Drop-off is the share of users who marked interest in this event but are not currently part of any team."
            />
            <MetricCard
              title="Avg Time-to-Match"
              value={metrics?.averageTimeToMatchHours != null ? `${metrics.averageTimeToMatchHours.toFixed(1)}h` : "N/A"}
            />
          </section>
        )}

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Open Spots By Team</h2>
            <div className="space-y-2">
              {(metrics?.openSpotsByTeam ?? []).map((team) => (
                <div key={team.teamId} className="flex items-center justify-between text-sm border-b border-border pb-1">
                  <span>{team.teamName}</span>
                  <span>{team.memberCount} members, {team.openSpots} open</span>
                </div>
              ))}
            </div>
            {metrics?.timeToMatchNote && (
              <p className="text-xs text-muted-foreground">{metrics.timeToMatchNote}</p>
            )}
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">Bulk Import Participants</h2>
              <p className="text-xs text-muted-foreground">CSV format: `email`</p>
              <Input type="file" accept=".csv,text/csv" onChange={(e) => setParticipantsFile(e.target.files?.[0] ?? null)} />
              <Button onClick={uploadParticipantsCsv} disabled={!participantsFile}>Import Participants CSV</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">Bulk Import Teams</h2>
              <p className="text-xs text-muted-foreground">CSV format: `team_name,member_emails` where member emails are separated by `;`</p>
              <Input type="file" accept=".csv,text/csv" onChange={(e) => setTeamsFile(e.target.files?.[0] ?? null)} />
              <Button onClick={uploadTeamsCsv} disabled={!teamsFile}>Import Teams CSV</Button>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-semibold">Join Requests</h2>
            {joinRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="space-y-2">
                {joinRequests.map((request, index) => (
                  <div key={`${request.teamId}-${request.userId}-${index}`} className="flex items-center justify-between border border-border rounded-md p-2">
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">{request.firstName} {request.lastName}</span> ({request.userEmail})
                      </p>
                      <p className="text-muted-foreground">Team: {request.teamName} (#{request.teamId})</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approveRequest(request.teamId, request.userId)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectRequest(request.teamId, request.userId)}>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">Edit Team</h2>
              <Input placeholder="Team ID" value={editTeamId} onChange={(e) => setEditTeamId(e.target.value)} />
              <Input placeholder="New Team Name" value={editTeamName} onChange={(e) => setEditTeamName(e.target.value)} />
              <Input
                placeholder="Member user IDs (comma separated)"
                value={editTeamMemberIds}
                onChange={(e) => setEditTeamMemberIds(e.target.value)}
              />
              <Button onClick={submitTeamEdit}>Save Team</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">Merge Teams</h2>
              <Input placeholder="From Team ID" value={mergeFromTeamId} onChange={(e) => setMergeFromTeamId(e.target.value)} />
              <Input placeholder="To Team ID" value={mergeToTeamId} onChange={(e) => setMergeToTeamId(e.target.value)} />
              <Button onClick={submitMergeTeams}>Merge</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">Split Team</h2>
              <Input placeholder="Source Team ID" value={splitTeamId} onChange={(e) => setSplitTeamId(e.target.value)} />
              <Input placeholder="New Team Name" value={splitTeamName} onChange={(e) => setSplitTeamName(e.target.value)} />
              <Input
                placeholder="User IDs to move (comma separated)"
                value={splitMemberIds}
                onChange={(e) => setSplitMemberIds(e.target.value)}
              />
              <Button onClick={submitSplitTeam}>Split</Button>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Teams In Event</h2>
            {teams.map((team) => (
              <div key={team.teamId} className="border border-border rounded-md p-2">
                <p className="font-medium">{team.teamName} (#{team.teamId})</p>
                <p className="text-xs text-muted-foreground">
                  Members: {team.members?.map((member) => `${member.firstName} ${member.lastName} (#${member.id})`).join(", ") || "None"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">User Directory</h2>
            <p className="text-xs text-muted-foreground">Use IDs below for edit/split actions.</p>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {allUsers.map((user) => (
                <p key={user.id} className="text-sm">
                  #{user.id} - {user.firstName} {user.lastName} ({user.email})
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  infoText,
}: {
  title: string;
  value: string | number;
  infoText?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          {infoText && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`${title} info`}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="text-xs leading-relaxed">
                {infoText}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default OrganizerDashboard;
