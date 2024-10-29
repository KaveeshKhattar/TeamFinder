import { useState } from "react";
import Header from "../../landingPage/components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function MakeEvent() {
    
    const location = useLocation();
    const navigate = useNavigate();
    const { collegeId } = location.state;

    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventVenue, setEventVenue] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const parsedTeamSize = parseInt(teamSize, 10); // Base 10 conversion
        if (isNaN(parsedTeamSize)) {
            alert("Please enter a valid number for team size.");
            return; // Prevent submission if team size is invalid
        }
        try {
            console.log("Starting...", collegeId, eventName, eventDate, eventTime, eventVenue, parsedTeamSize, eventDescription);
            const response = await axios.post("http://localhost:8080/api/events/createEvent", {
                collegeId, eventName, eventDate, eventTime, eventVenue, teamSize: parsedTeamSize, eventDescription
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            console.log("Finished");
            if (response.status === 200) {
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <>
        <Header></Header>

        <div className="flex flex-col">
        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required placeholder="Event Name" />
        
        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required placeholder="Event Date" />
        
        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="time" id="eventTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required placeholder="Event Date" />
        
        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="text" id="eventVenue" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required placeholder="Event Venue" />

        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="number" id="teamSize" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} required placeholder="Team Size" />

        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="textarea" id="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required placeholder="Event Description" />
        
        <button className="p-2 dark:bg-zinc-600 bg-slate-100" onClick={handleSubmit}>
        <input type="submit" />
        </button>
        </div>
        </>


    );
}

export default MakeEvent;
