import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../core/components/Loading";
import { Event } from "../../../types";
import SearchBar from "../../core/components/SearchBar";
import pic from "../assets/halloween.jpg"

function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isRep, setIsRep] = useState<boolean>(false);
    const [menuVisibleId, setMenuVisibleId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const { collegeId, collegeUrl } = location.state;
    const navigate = useNavigate();

    const fetchEvents = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:8080/api/${collegeId}/events`,
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
                "http://localhost:8080/api/college/events/searchEvents",
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
        const response = await axios.get("http://localhost:8080/users/checkIfRep", {
            params: {
                collegeId: collegeId
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setIsRep(response.data);
    }, [collegeId]);

    useEffect(() => {
        checkIfRep();
    }, [checkIfRep]);

    const toggleMenu = (id: number | null) => {
        setMenuVisibleId((prevId) => (prevId === id ? null : id));
    };

    // Dummy handlers for edit/delete (replace with actual functionality)
    const onEdit = (id: number) => {
        const eventDetails = events.find(event => event.id === id)

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
            `http://localhost:8080/api/events/event/${id}`,  // API endpoint with team ID
            {
            headers: {
                Authorization: `Bearer ${token}`,  // Authorization headers
            }
            }
        );

        // Check if the response indicates a successful deletion
        if (response.status === 200) {
            fetchEvents();
        }
        } catch (err) {
        console.error(err, "Deleting the team failed!");  // Improved error logging
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
            <Header title="Events"></Header>
            <SearchBar onChange={handleSearchChange} />

            {isRep && (
                <Link
                    to={`${location.pathname}/makeEvent`}
                    state={{ collegeId: collegeId, collegeUrl }}
                    className="flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-black dark:border-white w-full"
                >
                    <p className="m-1">Create an Event</p>
                    <i className="fa-solid fa-plus"></i>
                </Link>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-2">
                {events.map((event) => {
                    const eventName = event.name || "";
                    const formattedName = eventName.replace(/\s+/g, "-");
                    const eventUrl = formattedName.toLowerCase();

                    return (
                        <div key={event.id} className="relative">
                            <Link
                                to={`${location.pathname}/${eventUrl}`}
                                state={{
                                    eventId: event.id,
                                    eventURL: `http://localhost:5173/${location.pathname}/${eventUrl}`,
                                }}
                            >
                                <div className="dark:bg-zinc-600 bg-slate-100 rounded-md p-2">
                                    <img src={pic} alt="" className="rounded-md" />
                                    <p className="text-2xl text-black dark:text-white">
                                        {event.name}
                                    </p>
                                    <div className="flex justify-center items-center">
                                        <p className="font-bold mr-4 text-black dark:text-white">
                                            Team Size:{" "}
                                        </p>
                                        <p className="text-black dark:text-white">{event.teamSize}</p>
                                    </div>
                                </div>
                            </Link>

                            {isRep && (
                                <div className="absolute top-2 right-2">
                                    <button onClick={() => toggleMenu(event.id)} className="p-2">
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </button>

                                    {menuVisibleId === event.id && (
                                        <div className="absolute top-10 right-2 bg-white dark:bg-zinc-800 p-2 rounded-md shadow-md">
                                            <button
                                                onClick={() => onEdit(event.id)}
                                                className="block text-left text-black dark:text-white mb-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(event.id)}
                                                className="block text-left text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Events;
