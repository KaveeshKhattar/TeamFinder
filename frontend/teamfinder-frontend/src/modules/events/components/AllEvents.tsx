import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Event } from "../../../types";
import Header from "../../landingPage/components/Header";
import SearchBar from "../../core/components/SearchBar";
import { Link } from "react-router-dom";
import pic from "../assets/event.jpeg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { BASE_URL } from "../../../config";
import LoadingColleges from "../../home/components/LoadingColleges";

function AllEvents() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    // if (token == null) {
    //   navigate("/login");
    // }
    const fetchAllEventsResponse = await axios.get(
      `${BASE_URL}/api/events`,
    );
    if (fetchAllEventsResponse.status === 200) {
      setAllEvents(fetchAllEventsResponse.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("token");
    const value = e.target.value;

    if (value) {
      const responseFilteredEvents = await axios.get(
        `${BASE_URL}/api/events/searchAllEvents`,
        {
          params: {
            eventSearchTerm: value,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllEvents(responseFilteredEvents.data);
    } else {
      await fetchAllEvents();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <LoadingColleges />
      </div>
    );
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-2 min-h-screen">
        {allEvents.length > 0 ? (
          allEvents.map((event) => {
            const eventName = event.name || "";
            const formattedName = eventName.replace(/\s+/g, "-");
            const eventUrl = formattedName.toLowerCase();
            const oldDate = event.date;
            const date = new Date(oldDate);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "short" });
            const year = date.getFullYear();
            const time = date.toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            // Create the formatted date string
            const formattedDate = `${day} ${month} ${year}`;
            const formattedTime = `${time}`;

            return (
              <div
                key={event.id}
              >
                <Card className="w-full">
                  <CardHeader>
                    <img src={pic} alt="" className="rounded-md" />
                    <CardTitle className="text-left">{event.name}</CardTitle>
                    <CardDescription className="text-left">
                      Event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <p className="text-sm mr-1">Team Size:</p>
                      <p className="text-sm">{event.teamSize}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-sm mr-1">Date:</p>
                      <p className="text-sm">{formattedDate}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-sm mr-1">Time:</p>
                      <p className="text-sm">{formattedTime}</p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-sm mr-1">Venue:</p>
                      <p className="text-sm">{event.venue}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center items-center">
                    <Link
                      to={`${location.pathname}/${eventUrl}`}
                      state={{
                        eventId: event.id,
                        eventURL: `http://teamfinder-frontend.vercel.app/${location.pathname}/${eventUrl}`,
                      }}
                    >
                      <Button>
                        View Event
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            );
          })
        ) : (
          <>
            <p className="flex justify-center items-center">No Events</p>
          </>
        )}
      </div>
    </>
  );
}

export default AllEvents;
