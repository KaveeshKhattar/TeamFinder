import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ChatRoom } from "@/types";
import { useCurrentUser } from "../core/hooks/useCurrentUser";
import AuthRequiredDialog from "../core/components/AuthRequiredDialog";
import { Skeleton } from "../../components/ui/skeleton";

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
  const { eventId } = useParams<{ eventId: string }>();
  // Track interest state per user by id
  const [interestedInUser, setInterestedInUser] = useState<{ [userId: number]: boolean }>({});
  const [usersLoading, setUsersLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const loggedInUserId = user?.id ?? null;

  const fetchInterestedUsers = useCallback(async () => {
    if (!eventId) return; // 🔒 guard
    setUsersLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/api/events/${eventId}/interested-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch interested users", err);
      setUsers([]); // fail-safe
    } finally {
      setUsersLoading(false);
    }
  }, [eventId, token]);

  useEffect(() => {
    fetchInterestedUsers();
  }, [fetchInterestedUsers]);

  // get leads
  // Fetch users that the logged-in team is interested in ("leads")
  const fetchLeads = useCallback(async () => {
    if (!eventId || !loggedInUserId || !token) {
      setLeadsLoading(false);
      return;
    }
    setLeadsLoading(true);

    try {
      // Get a list of user projections this user has favorited for this event
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
    } finally {
      setLeadsLoading(false);
    }
  }, [eventId, loggedInUserId, token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleToggle = async (targetUserId: number) => {
    if (!token) {
      setAuthDialogOpen(true);
      return;
    }

    const previousState = !!interestedInUser[targetUserId];
    const nextState = !previousState;

    setInterestedInUser((prev) => ({
      ...prev,
      [targetUserId]: nextState,
    }));

    try {
      if (nextState) {
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

      // Reconcile from backend without blocking UI.
      void fetchLeads();
    } catch (err) {
      console.error("Failed to toggle favourite", err);
      setInterestedInUser((prev) => ({
        ...prev,
        [targetUserId]: previousState,
      }));
    }
  };
        
  const handleChatClick = async (otherUserId: number): Promise<void> => {
    if (!token) {
      setAuthDialogOpen(true);
      return;
    }

    const res = await axios.post<ChatRoom>(
      `${BASE_URL}/api/chats/start`,
      {otherUserId},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const roomId = res.data.id;
  
    navigate(`/chats?room=${roomId}`);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthRequiredDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        title="Log in to chat or favorite"
        description="Sign up or log in to favorite participants and start chats."
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Interested Users</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect with individuals interested in this event
          </p>
        </div>

        {usersLoading || leadsLoading ? (
          <div className="w-full max-w-2xl space-y-3 fade-in-soft">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : users.length === 0 ? (
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
                              className="w-24 h-24 rounded-full object-cover mb-4"
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
                          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800" onClick={() => handleChatClick(user.id)}>
                              <MessageCircle />
                                Chat
                              </Button>
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
