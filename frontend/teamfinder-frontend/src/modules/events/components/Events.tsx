import { useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const location = useLocation();
    const { collegeId } = location.state;
    
    console.log("CollegeID: ", collegeId);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Fetching Events");
                console.log(`Request URL: http://localhost:8080/api/colleges/${collegeId}`);
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
        };

        fetchEvents();
    }, [collegeId]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show an error message
    }


    return (
        <>
        <Header title="Events"></Header>
            <div className="flex border-2 bg-slate-100 rounded-md">
                <i className="fa-solid fa-magnifying-glass m-2 text-black "></i>
                <input type="text" placeholder="Search Colleges..." className="bg-slate-100 w-full" />
            </div>

            <div className="grid grid-cols-2 mt-4 gap-2">
                {events.map((event) => {
                    
                    const formattedName = event.name.replace(/\s+/g, '-');
                    const eventUrl = formattedName.toLowerCase()

                    return <Link to={`/${eventUrl}/events`} key={event.id}>
                    <div className="rounded-md">
                        <p className="text-black dark:text-white ">{event.name}</p>
                        <p className="text-black dark:text-white ">{event.venue}</p>
                        <p className="text-black dark:text-white ">{event.teamSize}</p>
                        <p className="text-black dark:text-white ">{event.description}</p>
                    </div>
                    </Link>
                })}
            </div>
        </>
    )
}

export default Events;