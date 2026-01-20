import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useParams } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../../components/ui/carousel";
import { Card, CardContent } from "../../../components/ui/card";
import { Toggle } from "../../../components/ui/toggle";
import { Heart } from "lucide-react";

type Team = {
    teamId: number;
    teamName: string;
    eventId: number;
    members: TeamMember[];
};

type TeamMember = {
    id: string;
    firstName: string;
    lastName: string;
    pictureURL: string;
    skills: string[];
};

function FindActualTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const { eventId } = useParams<{ eventId: string }>();
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
    const token = localStorage.getItem("token");
    const [interested, setInterested] = useState<{ [teamId: number]: boolean }>({});

    // Fetch logged-in user id
    useEffect(() => {
        const fetchLoggedInUserId = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data && res.data.id) {
                    setLoggedInUserId(res.data.id);
                }
            } catch (err) {
                console.error("Failed to fetch logged-in user profile", err);
            }
        };
        fetchLoggedInUserId();
    }, [token]);

    const fetchTeams = useCallback(async () => {
        if (!eventId) return;

        try {
            const res = await axios.get(
                `${BASE_URL}/api/events/${eventId}/teams`
            );

            const data = Array.isArray(res.data) ? res.data : [];
            setTeams(data);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch teams", err);
            setTeams([]);
        }
    }, [eventId]);

    useEffect(() => {
        fetchTeams();
        fetchAllInterestedTeamsForUser()
    }, [fetchTeams]);

    // Toggle favorite for a team
    const handleToggle = async (teamId: number) => {
        const currentState = interested[teamId] || false;
        const newState = !currentState;

        // Optimistically update UI
        setInterested(prev => ({
            ...prev,
            [teamId]: newState
        }));

        try {
            if (newState) {
                // Add to favorites
                await axios.post(
                    `${BASE_URL}/api/teams/${teamId}/favorite`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Remove from favorites
                await axios.delete(
                    `${BASE_URL}/api/teams/${teamId}/favorite`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (err) {
            console.error("Failed to toggle team favorite", err);
            // Revert on error
            setInterested(prev => ({
                ...prev,
                [teamId]: currentState
            }));
        }
    };

    // Check if current user is in the team
    const isUserInTeam = (team: Team) => {
        if (!loggedInUserId) return false;
        return team.members.some(member => Number(member.id) === loggedInUserId);
    };

    const fetchAllInterestedTeamsForUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const response = await axios.get(`${BASE_URL}/api/interested-teams`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200 && Array.isArray(response.data)) {
            // assuming response.data is an array of event IDs
            const interestedMap: { [teamId: number]: boolean } = {};
            response.data.forEach((teamId: number) => {
              interestedMap[teamId] = true;
            });
            setInterested(interestedMap);

          }
        } catch (err) {
          console.error("Failed to fetch interested teams:", err);
        }
      };


    return (
        <>
            <Header />
            <div className="min-h-screen bg-background">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">
                            Teams looking for members
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Connect with teams interested in this event
                        </p>
                    </div>

                    {teams.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                No interested teams found for this event.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Carousel className="w-full max-w-2xl">
                                <CarouselContent>
                                    {teams.map((team) => (
                                        <CarouselItem key={team.teamId} className="md:basis-1/2">
                                            <div className="p-1 sm:p-2">
                                                <Card className="border border-border">
                                                    <CardContent className="flex flex-col p-4 sm:p-6">
                                                        {/* Team Header */}
                                                        <div className="flex flex-col items-center mb-6 pb-4 border-b border-border">
                                                            <h2 className="text-xl font-semibold mb-1">
                                                                {team.teamName}
                                                                {isUserInTeam(team) && (
                                                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                                        (Your Team)
                                                                    </span>
                                                                )}
                                                            </h2>
                                                        </div>

                                                        {/* Team Members */}
                                                        <div className="mb-4">
                                                            {team.members.map((member) => (
                                                                <div
                                                                    key={member.id}
                                                                    className="flex space-x-2 items-center mb-2"
                                                                >
                                                                    <img
                                                                        src={member.pictureURL}
                                                                        alt={`${member.firstName} ${member.lastName}`}
                                                                        className="w-12 h-12 rounded-full object-cover"
                                                                    />
                                                                    <div>
                                                                        {member.firstName} {member.lastName}
                                                                        {Number(member.id) === loggedInUserId && (
                                                                            <span className="ml-1.5 text-sm text-muted-foreground">
                                                                                (You)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Favorite Toggle - Only show if user is NOT in team */}
                                                        {!isUserInTeam(team) && (
                                                            <div className="mt-auto pt-4 border-t border-border">
                                                                <Toggle
                                                                    aria-label="Toggle favorite"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    pressed={!!interested[team.teamId]}
                                                                    onPressedChange={() => handleToggle(team.teamId)}
                                                                    className="w-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                                                >
                                                                    <Heart
                                                                        className={`w-4 h-4 mr-2 ${
                                                                            interested[team.teamId]
                                                                                ? "fill-primary-foreground stroke-primary-foreground"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                    {interested[team.teamId]
                                                                        ? "Favorited"
                                                                        : "Add to Favorites"}
                                                                </Toggle>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default FindActualTeams;