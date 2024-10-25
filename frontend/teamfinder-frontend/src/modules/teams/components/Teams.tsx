import { Link, useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../core/components/Loading";
import { Member, Team } from "../../../types";
import TeamsList from "./TeamsList";
import IndividualList from "./IndividualList";
import SearchBar from "../../core/components/SearchBar";

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewingTeams, setisViewingTeams] = useState<boolean>(true);
  const [individuals, setIndividuals] = useState<Member[]>([]);
  const [userId, setUserId] = useState(0);
  const [makeTeamPossible, setMakeTeamPossible] = useState<boolean>(true);

  const location = useLocation();
  const { eventId, eventURL } = location.state;

  const fetchInterestedIndividuals = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/${eventId}/InterestedIndividuals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIndividuals([...response.data]);
    } catch (err) {
      setError("Error fetching teams");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/${eventId}/teams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeams([...response.data]);
    } catch (err) {
      setError("Error fetching teams");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("token");
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const responseFilteredTeams = await axios.get(
        "http://localhost:8080/api/teams/searchTeams",
        {
          params: {
            name: searchTerm,
            eventId: eventId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responseFilteredTeams.data === "") {
        setTeams([]);
      }

      setTeams(responseFilteredTeams.data);
    } else {
      fetchTeams();
    }
  };

  const handleViewingTeamsOrIndividuals = () => {
    setisViewingTeams(!isViewingTeams);
    fetchInterestedIndividuals();
  };

  const handleClickInterested = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUserId(response.data.id);
      }
    } catch (err) {
      console.log(err, "Sign up failed!");
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/events/InterestedIndividual",
        {
          userId: userId,
          eventId: eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchInterestedIndividuals();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfProfileIsMemberOfTeam = useCallback(async () => {
    try {
      console.log("Calling to check if profile has a team in this event...");

      const profilesTeams = JSON.parse(
        localStorage.getItem("profileTeams") || "[]"
      );
      console.log("Profile Teams: ", profilesTeams);
      const eventExists = profilesTeams.some(
        (team: { eventId: number }) => team.eventId === eventId
      );
      console.log("Event exists: ", eventExists);
      // Set the link to disabled if the current eventId is found in the array
      setMakeTeamPossible(eventExists);
    } catch (err) {
      console.log(err);
    }
  }, [eventId]);

  useEffect(() => {
    checkIfProfileIsMemberOfTeam();
  }, [checkIfProfileIsMemberOfTeam]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  return (
    <>
      <Header title={isViewingTeams ? "Teams" : "Individuals"}></Header>

      <div className="flex flex-col ">
        <SearchBar onChange={handleSearchChange} />

        <div>
          <button
            type="button"
            onClick={handleViewingTeamsOrIndividuals}
            className="w-full bg-orange-500 mt-1 p-2 dark:text-white text-black"
          >
            <p>{isViewingTeams ? "View Individuals" : "View Teams"}</p>
          </button>
        </div>

        <div>
          {isViewingTeams ? (
            <Link
              to={`${location.pathname}/makeTeam`}
              state={{ eventID: eventId, eventUrl: eventURL }}
              className={`flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-black dark:border-white w-full ${
                makeTeamPossible ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <p className="m-1">Make a Team</p>
              <i className="fa-solid fa-plus"></i>
            </Link>
          ) : (
            <button
              className="flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-black dark:border-white w-full"
              onClick={handleClickInterested}
            >
              <p className="m-1">I'm Interested</p>
            </button>
          )}
        </div>
      </div>

      {isViewingTeams ? (
        <div className="grid grid-cols-1 mt-4 gap-2">
          <TeamsList
            teams={teams}
            location={`${location.pathname}`}
          ></TeamsList>
        </div>
      ) : (
        <div>
          <IndividualList individuals={individuals}></IndividualList>
        </div>
      )}
    </>
  );
}

export default Teams;
