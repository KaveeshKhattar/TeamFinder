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
import { BASE_URL } from "../../../config";
import LoadingColleges from "../../home/components/LoadingColleges";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = localStorage.getItem("role");

  console.log("ROLE: ", role);

  const location = useLocation();
  const { collegeId } = location.state;
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/${collegeId}/events`,
      );
      if (response.status === 204) {
        setEvents([]);
        setError("No Events found");
      } else if (response.status === 200) {
        setEvents([...response.data]);
      }
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
    const value = e.target.value;

    if (value) {
      const responseFilteredEvents = await axios.get(
        `${BASE_URL}/api/${collegeId}/searchEvents`,
        {
          params: {
            eventSearchTerm: value,
          },
        }
      );
      setEvents(responseFilteredEvents.data);
    } else {
      fetchEvents();
    }
  };

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
        <LoadingColleges />
      </>
    );
  }

  if (error) {
    return <div className="min-h-screen">{error}</div>;
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-2 min-h-screen">
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
                      eventURL: `https://teamfinder-frontend.vercel.app/${location.pathname}/${eventUrl}`,
                    }}
                  >
                    <Button className="mr-2">View Event</Button>
                  </Link>
                  {role === "REPRESENTATIVE" && (
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
