import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Event } from "../../../types";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  pictureURL: string;
  bio: string;
  skills: string[];
};

interface IndividualsUserIsInterestedInForEventProps {
  event: Event | undefined;
}

function IndividualsUserIsInterestedInForEvent({ event }: IndividualsUserIsInterestedInForEventProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Function to get matches [user1, user_2, based on the event_id]
  // Function to convert all user_2 to user objects using axios
  const fetchLeads = useCallback(async () => {
    if (!event?.id || !token) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/events/${event.id}/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [event?.id, token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Function to display all user objects in a list
  if (!event) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please select an event to view individuals you're interested in.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading...</div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No individuals found. You haven't marked anyone as interested for this event yet.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Individuals you're interested in for {event.name}
      </h3>
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex justify-around gap-4">
                <div className="flex flex-col items-center justify-center">
                <img
                  src={
                    user.pictureURL
                      ? user.pictureURL
                      : "/default-profile.png"
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h4 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.bio && (
                    <p className="text-sm mt-2 text-gray-700">{user.bio}</p>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
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

export default IndividualsUserIsInterestedInForEvent;
