import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Event, Team } from "../../../types";
import { Card, CardContent } from "../../../components/ui/card";

interface TeamsUserIsInterestedInForEventProps {
    event: Event | undefined;
}

function TeamsCreatedPerEventByUser({ event }: TeamsUserIsInterestedInForEventProps) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchLeads = useCallback(async () => {
        if (!event?.id || !token) {
            setTeams([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `${BASE_URL}/api/events/${event.id}/teams-part-of`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 && Array.isArray(response.data)) {
                setTeams(response.data);
                console.log("teams Created!!!!!" + response.data); // Changed from teams to response.data
            }
        } catch (err) {
            console.error("Failed to fetch teams:", err);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    }, [event?.id, token]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    if (!event) {
        return (
            <div className="p-4 text-center text-gray-500">
                Please select an event to view teams you've created.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 text-center text-gray-500">Loading...</div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No teams found. You haven't marked any team as interested for this event yet.
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">
                Teams you're a part of for {event.name}
            </h3>
            <div className="space-y-4">
                {teams.map((team) => (
                    <Card key={team.teamId}>
                        <CardContent className="p-4">
                            <div className="flex justify-around gap-4">
                                <div className="flex flex-col items-center justify-center">
                                    <h4 className="font-semibold text-lg mb-2">{team.teamName}</h4>

                                    {team.members && team.members.length > 0 ? (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {team.members.map((member) => (
                                                <span
                                                    key={member.id}
                                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                                >
                                                    {member.firstName} {member.lastName}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 mt-2">No members listed</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default TeamsCreatedPerEventByUser;