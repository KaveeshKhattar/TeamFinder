import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Event } from "../../../types";
import Header from "../../landingPage/components/Header";
import SearchBar from "../../core/components/SearchBar";
import { Link, useNavigate } from "react-router-dom";
import pic from "../assets/halloween.jpg"

function AllEvents() {

    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const navigate = useNavigate();

    const fetchAllEvents = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token == null) {
            navigate("/login");
        }
        const fetchAllEventsResponse = await axios.get(
            "http://localhost:8080/api/events",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (fetchAllEventsResponse.status === 200) {
            setAllEvents(fetchAllEventsResponse.data);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents])

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const token = localStorage.getItem("token");
        const value = e.target.value;
        
        if (value) {
            const responseFilteredEvents = await axios.get(
                "http://localhost:8080/api/events/searchAllEvents",
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

    return (
        <>
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-2">
                {allEvents.length > 0 ? allEvents.map((event) => {
                    const eventName = event.name || "";
                    const formattedName = eventName.replace(/\s+/g, "-");
                    const eventUrl = formattedName.toLowerCase();

                    return (
                        <Link
                            to={`${location.pathname}/${eventUrl}`}
                            state={{
                                eventId: event.id,
                                eventURL: `http://localhost:5173/${location.pathname}/${eventUrl}`,
                            }}
                            key={event.id}
                        >
                            <div className="dark:bg-zinc-600 bg-slate-100 rounded-md p-2">
                                <img src={pic} alt="" className="rounded-md" />
                                <p className="text-2xl text-black dark:text-white ">
                                    {event.name}
                                </p>

                                <div className="flex justify-center items-center">
                                    <p className="font-bold mr-4 text-black dark:text-white">
                                        Team Size:{" "}
                                    </p>
                                    <p className="text-black dark:text-white">{event.teamSize}</p>
                                </div>

                                <p className="text-sm text-black dark:text-white ">
                                    Venue: {event.venue}
                                </p>
                                {/* <p className="text-sm text-black dark:text-white ">
                                    Date: {event.date}
                                </p> */}
                                <p className="text-sm mt-4 text-black dark:text-white ">
                                    Fun Facts: {event.description}
                                </p>
                            </div>
                        </Link>
                    );
                }) : (
                    <>
                        <p className="flex justify-center items-center">No Events</p>
                    </>
                )}
            </div>
        </>
    )
}

export default AllEvents;