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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewingTeams, setisViewingTeams] = useState<boolean>(true);
  const [individuals, setIndividuals] = useState<Member[]>([]);
  const [userId, setUserId] = useState(0);
  const [isPartOfAnyTeam, setIsPartOfAnyTeam] = useState(false);
  const [IsUserInterestedAlreadyBool, setIsUserInterestedAlreadyBool] = useState<boolean>();

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
      setIsUserInterestedAlreadyBool(individuals.some((individual) => individual.id === userId));
      console.log("INDIVID bool: ", IsUserInterestedAlreadyBool);

    } catch (err) {
      setError("Error fetching teams");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAndCheckMembership = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch user profile to get userId
      const profileResponse = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.status === 200) {
        const fetchedUserId = profileResponse.data.id;
        setUserId(fetchedUserId); // Update userId state
        console.log("USER ID:" , fetchedUserId);
        // Now check team membership using the fetched userId
      }

    } catch (error) {
      console.error('Error in fetching user profile or checking team membership:', error);
    }

    try {
      // Fetch user profile to get userId
      const response = await axios.get("http://localhost:8080/api/isPartOfAny", {
        params:{
          eventId: eventId,
          userId: userId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {

        setIsPartOfAnyTeam(response.data);
      }

    } catch (error) {
      console.error('Error in fetching user profile or checking team membership:', error);
    }
  }, [eventId, userId]);

  // useEffect to run the combined function
  useEffect(() => {
    fetchUserAndCheckMembership(); // Call the combined function on component mount
  }, [fetchUserAndCheckMembership]);

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
    const value = e.target.value;

    try {
      // Filter the fetched teams based on the search term
      const filteredTeams = teams.filter((team) =>
        team.members.some((member) =>
          member.fullName.toLowerCase().includes(value.toLowerCase()) // Use value instead of searchTerm
        )
      );

      // Check if there are any filtered teams and update state
      if (filteredTeams.length > 0) {
        setTeams(filteredTeams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      // Optionally, you can handle errors here
      // e.g., show an error message or fallback to default state
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
        setIsUserInterestedAlreadyBool(true);
        fetchInterestedIndividuals();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickNotInterested = async () => {

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
      const response = await axios.delete(
        "http://localhost:8080/api/events/InterestedIndividual",
        {
          params: {
            userID: userId,
            eventId: eventId,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Replace 'token' with your actual token variable
          },
        }
      );

      if (response.status === 200) {
        setIsUserInterestedAlreadyBool(false)
        fetchInterestedIndividuals();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isUserInterestedAlready = useCallback(async () => {
    const token = localStorage.getItem("token");
    let isUserInterestedUserId = 0;
    try {
      const response = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        isUserInterestedUserId = response.data.id;
      }
    } catch (err) {
      console.log(err, "Sign up failed!");
    }
    try {
      const response = await axios.get(
        "http://localhost:8080/api/events/isUserInterestedAlready",
        {
          params: {
            userId: isUserInterestedUserId,
            eventId: eventId
          }, 
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setIsUserInterestedAlreadyBool(response.data)
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  }, [eventId]);

  useEffect(() => {
    isUserInterestedAlready()
  }, [isUserInterestedAlready])

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
              className={`flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-black dark:border-white w-full ${isPartOfAnyTeam ? "pointer-events-none opacity-50" : ""
                }`}
            >
              <p className="m-1">Make a Team</p>
              <i className="fa-solid fa-plus"></i>
            </Link>
          ) : (
            <div className="flex">
              <button
              className="flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-green-500 dark:border-white w-full mr-2"
              onClick={handleClickInterested}
            >
              <p className="m-1">Interested</p>
            </button>
            <button
              className="flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-red-500 dark:border-white w-full"
              onClick={handleClickNotInterested}
            >
              <p className="m-1">Not Interested</p>
            </button>
            </div>
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