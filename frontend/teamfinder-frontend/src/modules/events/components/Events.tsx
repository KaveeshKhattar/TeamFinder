import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Loading from "../../core/components/Loading";

interface Event {
    id: number;
    collegeId: number;
    date: Date;
    name: string;
    venue: string;
    teamSize: number;
    description: string;
}

function Events() {

    const [events, setEvents] = useState<Event[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const location = useLocation();
    const { collegeId } = location.state;

    const fetchEvents = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/colleges/${collegeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setEvents([...response.data])
            
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
        setSearchTerm(value);

        if (value) {
            const responseFilteredEvents = await axios.get(
                "http://localhost:8080/api/colleges/events/searchEvents", 
                {
                    params: {
                        name: searchTerm,
                        collegeId: collegeId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Response: ", responseFilteredEvents)
            setEvents(responseFilteredEvents.data);
        } else {
            fetchEvents();
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>; // Show an error message
    }

    return (
        <>
        <Header title="Events"></Header>
            <div className="flex border-2 bg-slate-100 rounded-md">
                <i className="fa-solid fa-magnifying-glass m-2 text-black "></i>
                <input type="text" placeholder="Search Events..." className="bg-slate-100 w-full" onChange={handleSearchChange}/>
            </div>

            <div className="grid grid-cols-2 mt-4 gap-2">
                {events.map((event) => {
                    
                    const eventName = event.name || '';
                    const formattedName = eventName.replace(/\s+/g, '-');
                    const eventUrl = formattedName.toLowerCase()

                    return <Link to={`${location.pathname}/${eventUrl}`} state={{ eventId: event.id, eventURL: `http://localhost:5173/${location.pathname}/${eventUrl}` }} key={event.id}>
                    <div className="dark:bg-zinc-600 bg-slate-100 rounded-md p-2">
                        <p className="text-2xl text-black dark:text-white ">{event.name}</p>

                        <div className="flex justify-center items-center">
                            <p className="font-bold mr-4 text-black dark:text-white">Team Size: </p>
                            <p className="text-black dark:text-white">{event.teamSize}</p>
                        </div>                        
                    </div>
                    </Link>
                })}
            </div>
        </>
    )
}

export default Events;