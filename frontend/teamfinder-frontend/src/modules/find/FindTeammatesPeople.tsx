import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../config";
import Header from "../landingPage/components/Header";
import { useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";
import { Toggle } from "../../components/ui/toggle";
import defaultProfilePicture from "../profile/assets/blank-profile-picture-973460_1280.webp";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  pictureURL: string;
  bio: string;
  skills: string[];
};

function FindTeammatesPeople() {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  // Track interest state per user by id
  const [interestedInUser, setInterestedInUser] = useState<{ [userId: number]: boolean }>({});

  const token = localStorage.getItem("token");

  // Fetch logged-in user id
  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      if (!token) return;
      try {
        // Get user email from token (decode JWT or use backend endpoint)
        // Here, we assume a backend endpoint exists to get the user profile
        const res = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.data && res.data.data.id) {
          setLoggedInUserId(res.data.data.id);
        }
      } catch (err) {
        console.error("Failed to fetch logged-in user profile", err);
      }
    };
    fetchLoggedInUserId();
  }, [token]);

  const fetchInterestedUsers = useCallback(async () => {
    if (!eventId) return; // 🔒 guard

    try {
      const res = await axios.get(
        `${BASE_URL}/api/events/${eventId}/interested-users`
      );

      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch interested users", err);
      setUsers([]); // fail-safe
    }
  }, [eventId]);

  useEffect(() => {
    fetchInterestedUsers();
  }, [fetchInterestedUsers]);

  // get leads
  // Fetch users that the logged-in team is interested in ("leads")
  const fetchLeads = useCallback(async () => {
    if (!eventId || !loggedInUserId || !token) return;

    try {
      // Get a list of user projections this team is interested in
      const res = await axios.get(
        `${BASE_URL}/api/events/${eventId}/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set interestedInUser state for easy favourite status
      // Backend returns UserProjection objects, so we need to extract the IDs
      if (Array.isArray(res.data.data)) {
        const interestedObj: { [userId: number]: boolean } = {};
        res.data.data.forEach((user: { id: number }) => {
          if (user && user.id) {
            interestedObj[user.id] = true;
          }
        });
        setInterestedInUser(interestedObj);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
      // Initialize as empty object if fetch fails
      setInterestedInUser({});
    }
  }, [eventId, loggedInUserId, token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleToggle = async (targetUserId: number) => {
    try {
      const isCurrentlyInterested = !!interestedInUser[targetUserId];

      if (!isCurrentlyInterested) {
        // ❤️ ADD favourite
        await axios.post(
          `${BASE_URL}/api/leads`,
          {
            eventId: eventId,
            userId: targetUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // 💔 REMOVE favourite
        await axios.delete(`${BASE_URL}/api/leads`, {
          data: {
            eventId: eventId,
            userId: targetUserId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      // Refetch leads from the backend to get the updated state
      await fetchLeads();
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Interested Users</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect with individuals interested in this event
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No interested users found for this event.</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Carousel className="w-full max-w-2xl">
              <CarouselContent>
                {users.map((user) => (
                  <CarouselItem key={user.id} className="md:basis-1/2">
                    <div className="p-1 sm:p-2">
                      <Card className="border border-border">
                        <CardContent className="flex flex-col p-4 sm:p-6">
                          {/* Profile Picture and Name */}
                          <div className="flex flex-col items-center mb-6">
                            <img
                              src={user.pictureURL || defaultProfilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-24 h-24 rounded-full object-cover border-2 border-border mb-4"
                            />
                            <h2 className="text-xl font-semibold mb-1">
                              {user.firstName} {user.lastName}
                              {loggedInUserId === user.id && (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                  (You)
                                </span>
                              )}
                            </h2>
                          </div>

                          {/* Bio */}
                          {user.bio && (
                            <div className="mb-6">
                              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Bio
                              </h3>
                              <p className="text-sm text-foreground leading-relaxed">
                                {user.bio}
                              </p>
                            </div>
                          )}

                          {/* Skills */}
                          <div className="mb-6">
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                              Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1.5 rounded-md text-sm bg-muted text-muted-foreground border border-border"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No skills listed</p>
                              )}
                            </div>
                          </div>

                          {/* Favorite Toggle */}
                          {loggedInUserId !== user.id && (
                            <div className="mt-auto pt-4 border-t border-border">
                              <Toggle
                                aria-label="Toggle favorite"
                                size="sm"
                                variant="outline"
                                pressed={!!interestedInUser[user.id]}
                                onPressedChange={() => handleToggle(user.id)}
                                className="w-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                              >
                                <Heart
                                  className={`w-4 h-4 mr-2 ${interestedInUser[user.id]
                                      ? "fill-primary-foreground stroke-primary-foreground"
                                      : ""
                                    }`}
                                />
                                {interestedInUser[user.id] ? "Favorited" : "Add to Favorites"}
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
  );
}

export default FindTeammatesPeople;
