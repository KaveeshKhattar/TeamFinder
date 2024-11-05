import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../core/components/Loading";
import { Event } from "../../../types";
import SearchBar from "../../core/components/SearchBar";
import pic from "../assets/halloween.jpg";
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

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isRep, setIsRep] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { collegeId, collegeUrl } = location.state;
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://teamfinder-frontend.vercel.app//api/${collegeId}/events`,
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
        "https://teamfinder-production.up.railway.app/api/college/events/searchEvents",
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
    const response = await axios.get("https://teamfinder-production.up.railway.app/users/checkIfRep", {
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

  // Dummy handlers for edit/delete (replace with actual functionality)
  const onEdit = (id: number) => {
    const eventDetails = events.find((event) => event.id === id);

    const eventName = eventDetails?.name || "";
    const formattedName = eventName.replace(/\s+/g, "-");
    const eventUrl = formattedName.toLowerCase();
    navigate(`${location.pathname}/${eventUrl}/edit`, {
      state: { event: eventDetails },
    });
    // Implement edit functionality here
  };

  const onDelete = async (id: number) => {
    console.log("Delete event with id:", id);
    const token = localStorage.getItem("token");

    try {
      // Make the DELETE request to the API endpoint with the team ID in the URL
      const response = await axios.delete(
        `https://teamfinder-production.up.railway.app/api/events/event/${id}`, // API endpoint with team ID
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization headers
          },
        }
      );

      // Check if the response indicates a successful deletion
      if (response.status === 200) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err, "Deleting the team failed!"); // Improved error logging
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header></Header>
      <SearchBar onChange={handleSearchChange} />

      {isRep && (
        <>
          <Link
            to={`${location.pathname}/makeEvent`}
            state={{ collegeId: collegeId, collegeUrl }}
            className="flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-black dark:border-white w-full"
          >
            <p className="m-1">Create an Event</p>
            <i className="fa-solid fa-plus"></i>
          </Link>

          {/* <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create an Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-full">
              <DialogHeader>
                <DialogTitle>Create an Event</DialogTitle>
                <DialogDescription>
                  Create a new event for your university here. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventName" className="text-right">
                    Name
                  </Label>
                  <Input
                    className="col-span-3"
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    placeholder="Event Name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventName" className="text-right">
                    Date
                  </Label>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !eventDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>


                  <Input
                    className="col-span-3"
                    type="date"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    placeholder="Event Date"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventName" className="text-right">
                    Time
                  </Label>
                  <Input className="col-span-3" type="time" id="eventTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required placeholder="Event Date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </>
      )}

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
