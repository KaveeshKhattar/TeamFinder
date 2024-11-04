import { useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

function EditEvents() {

    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventVenue, setEventVenue] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const location = useLocation();
    const {event} = location.state;
    const navigate = useNavigate();

    const handleSubmit = async () => {
      const token = localStorage.getItem("token");
      try {
        console.log("calling..");
        const response = await axios.put(
          `http://localhost:8080/api/events/event/${event.id}`, null, 
          {
            params: {
              eventName: eventName,
              eventDate: eventDate,
              eventTime: eventTime,
              teamSize: teamSize,
              eventVenue: eventVenue,
              eventDescription: eventDescription
            }, headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status === 200) {
          console.log("edited succas");
          navigate(-1);
        } else {
          console.log("not edited bigger succas");
        }
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(() => {
      setEventName(event.name || "");
      
      setEventDescription(event.description || "");
      setTeamSize(event.teamSize || "");
      setEventVenue(event.venue || "");

      const parsedDate = new Date(event.date);

      const year = parsedDate.getUTCFullYear();
      const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getUTCDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`
      setEventDate(date || "");

      const hours = String(parsedDate.getUTCHours()).padStart(2, "0");
      const minutes = String(parsedDate.getUTCMinutes()).padStart(2, "0");
      const seconds = String(parsedDate.getUTCSeconds()).padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;
      setEventTime(time || "");

    }, [event.date, event.description, event.name, event.teamSize, event.time, event.venue])

  return (
    <>
    <Header></Header>

    <div className="flex flex-col">
    <Input className="mb-2" type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required placeholder="Event Name" />
    
    <Input className="mb-2"type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required placeholder="Event Date" />
    
    <Input className="mb-2"type="time" id="eventTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required placeholder="Event Date" />
    
    <Input className="mb-2"type="text" id="eventVenue" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required placeholder="Event Venue" />

    <Input className="mb-2"type="number" id="teamSize" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} required placeholder="Team Size" />

    <Input className="mb-2"type="textarea" id="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required placeholder="Event Description" />
    
    <Button onClick={handleSubmit}>
      Submit
    </Button>
    </div>
    </>


);
}

export default EditEvents;
