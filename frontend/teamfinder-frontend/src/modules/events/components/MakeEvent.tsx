import { useState } from "react";
import Header from "../../landingPage/components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { BASE_URL } from "../../../config";

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
            const response = await axios.post(`${BASE_URL}/api/events/createEvent`, {
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
        <Input className="mb-2" type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required placeholder="Event Name" />
        
        <Input className="mb-2" type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required placeholder="Event Date" />
        
        <Input className="mb-2" type="time" id="eventTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required placeholder="Event Date" />
        
        <Input className="mb-2" type="text" id="eventVenue" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required placeholder="Event Venue" />

        <Input className="mb-2" type="number" id="teamSize" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} required placeholder="Team Size" />

        <Input className="mb-2" type="textarea" id="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required placeholder="Event Description" />
        
        <Button onClick={handleSubmit}>
        <input type="submit" />
        </Button>
        </div>
        </>


    );
}

export default MakeEvent;
