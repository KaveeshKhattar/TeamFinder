import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Event } from "../../../types";
import SearchBar from "../../core/components/SearchBar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Skeleton } from "../../../components/ui/skeleton";
import { BASE_URL } from "../../../config";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isRep, setIsRep] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { collegeId } = location.state;
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/${collegeId}/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents([...response.data]);
    } catch (err) {
      setError("Error fetching events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [collegeId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("token");
    const value = e.target.value;

    if (value) {
      const responseFilteredEvents = await axios.get(
        `${BASE_URL}/api/college/events/searchEvents`,
        {
          params: {
            eventSearchTerm: value,
            collegeId: collegeId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(responseFilteredEvents.data);
    } else {
      fetchEvents();
    }
  };

  const checkIfRep = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/users/checkIfRep`, {
      params: {
        collegeId: collegeId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setIsRep(response.data);
  }, [collegeId]);

  useEffect(() => {
    checkIfRep();
  }, [checkIfRep]);

  const onEdit = (id: number) => {
    const eventDetails = events.find((event) => event.id === id);

    const eventName = eventDetails?.name || "";
    const formattedName = eventName.replace(/\s+/g, "-");
    const eventUrl = formattedName.toLowerCase();
    navigate(`${location.pathname}/${eventUrl}/edit`, {
      state: { event: eventDetails },
    });
  };

  const onDelete = async (id: number) => {
    console.log("Delete event with id:", id);
    const token = localStorage.getItem("token");

    try {

      const response = await axios.delete(
        `${BASE_URL}/api/events/event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err, "Deleting the team failed!");
    }
  };

  if (loading) {
    return (
      <>
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        { }
        <div className="min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-4">
          <Card className="flex flex-col items-center justify-center">
            <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
            <Skeleton className=" h-4 w-[80%] mt-2" />
            <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
          </Card>

          <Card className="flex flex-col items-center justify-center">
            <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
            <Skeleton className=" h-4 w-[80%] mt-2" />
            <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
          </Card>

          <Card className="flex flex-col items-center justify-center">
            <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
            <Skeleton className=" h-4 w-[80%] mt-2" />
            <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
          </Card>

          <Card className="flex flex-col items-center justify-center">
            <Skeleton className="h-[125px] w-[80%] m-4 rounded-md" />
            <Skeleton className=" h-4 w-[80%] mt-2" />
            <Skeleton className="h-4 w-[80%] mt-2 mb-8" />
          </Card>
        </div>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-2">
        {events.map((event) => {
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
            <div key={event.id}>
              <Card className="w-full">
                <CardHeader>
                  <img src={pic} alt="" className="rounded-md" />
                  <CardTitle className="text-left">{event.name}</CardTitle>
                  <CardDescription className="text-left">Event</CardDescription>
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
                      eventURL: `https://teamfinder-frontend.vercel.app/${location.pathname}/${eventUrl}`,
                    }}
                  >
                    <Button className="p-5 mr-2">View Event</Button>
                  </Link>
                  {isRep && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded-md bg-black text-white">
                          Manage Event
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex flex-col items-center">
                          <DropdownMenuItem onClick={() => onEdit(event.id)}>
                            <Button>Edit Event</Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(event.id)}>
                            <Button variant="destructive">Delete Event</Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Events;
