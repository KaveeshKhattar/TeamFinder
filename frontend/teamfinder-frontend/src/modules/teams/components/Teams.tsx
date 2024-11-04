import { Link, useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../core/components/Loading";
import { Member, Team } from "../../../types";
import TeamsList from "./TeamsList";
import IndividualList from "./IndividualList";
import SearchBar from "../../core/components/SearchBar";
import { Button } from "../../../components/ui/button";

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewingTeams, setisViewingTeams] = useState<boolean>(true);
  const [individuals, setIndividuals] = useState<Member[]>([]);
  const [userId, setUserId] = useState(0);
  const [isPartOfAnyTeam, setIsPartOfAnyTeam] = useState(false);
  const [IsUserInterestedAlreadyBool, setIsUserInterestedAlreadyBool] =
    useState<boolean>();

  const location = useLocation();
  const { eventId, eventURL } = location.state;

  const fetchInterestedIndividuals = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://teamfinder-wpal.onrender.com/api/events/${eventId}/InterestedIndividuals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIndividuals([...response.data]);
      setIsUserInterestedAlreadyBool(
        individuals.some((individual) => individual.id === userId)
      );
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
      const profileResponse = await axios.get(
        "https://teamfinder-wpal.onrender.com/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (profileResponse.status === 200) {
        const fetchedUserId = profileResponse.data.id;
        setUserId(fetchedUserId); // Update userId state
        console.log("USER ID:", fetchedUserId);
        // Now check team membership using the fetched userId
      }
    } catch (error) {
      console.error(
        "Error in fetching user profile or checking team membership:",
        error
      );
    }

    try {
      // Fetch user profile to get userId
      const response = await axios.get(
        "https://teamfinder-wpal.onrender.com/api/isPartOfAny",
        {
          params: {
            eventId: eventId,
            userId: userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsPartOfAnyTeam(response.data);
      }
    } catch (error) {
      console.error(
        "Error in fetching user profile or checking team membership:",
        error
      );
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
        `https://teamfinder-wpal.onrender.com/api/events/${eventId}/teams`,
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
    if (value) {
      try {
        // Filter the fetched teams based on the search term
        console.log("Trying...", teams, value);
        const filteredTeams = teams.filter((team) =>
          team.members.some(
            (member) =>
              member.fullName.toLowerCase().includes(value.toLowerCase()) // Use value instead of searchTerm
          )
        );
        console.log("Filtered teams:", filteredTeams);

        setTeams(filteredTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
        // Optionally, you can handle errors here
        // e.g., show an error message or fallback to default state
      }
    } else {
      await fetchTeams();
    }
  };

  const handleViewingTeamsOrIndividuals = () => {
    setisViewingTeams(!isViewingTeams);
    fetchInterestedIndividuals();
  };

  const handleClickInterested = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://teamfinder-wpal.onrender.com/users/profile", {
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
        "https://teamfinder-wpal.onrender.com/api/events/InterestedIndividual",
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
        "https://teamfinder-wpal.onrender.com/api/events/InterestedIndividual",
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
        setIsUserInterestedAlreadyBool(false);
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
      const response = await axios.get("https://teamfinder-wpal.onrender.com/users/profile", {
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
        "https://teamfinder-wpal.onrender.com/api/events/isUserInterestedAlready",
        {
          params: {
            userId: isUserInterestedUserId,
            eventId: eventId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsUserInterestedAlreadyBool(response.data);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  }, [eventId]);

  useEffect(() => {
    isUserInterestedAlready();
  }, [isUserInterestedAlready]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  return (
    <>
      <Header></Header>

      <div className="flex flex-col ">
        <SearchBar
          placeholder="Find teams by your friends' name"
          onChange={handleSearchChange}
        />

        <Button onClick={handleViewingTeamsOrIndividuals}>
          <p>{isViewingTeams ? "View Individuals" : "View Teams"}</p>
        </Button>

        <div>
          {isViewingTeams ? (
            <>
            <Link
              to={`${location.pathname}/makeTeam`}
              state={{ eventID: eventId, eventUrl: eventURL }}
            >
              <Button
                onClick={handleViewingTeamsOrIndividuals}
                className={`${
                  isPartOfAnyTeam ? "pointer-events-none bg-gray-400" : ""
                } mt-2 w-full`}
              >
                <p className="m-1">Make a Team</p>
                <i className="fa-solid fa-plus"></i>
              </Button>
            </Link>
            </>
            
          ) : (
            <div className="flex mt-2 justify-between">
              <button
                className="bg-green-500 w-1/2 mr-2 rounded-md text-white"
                onClick={handleClickInterested}
              >
                <p className="m-1">Interested</p>
              </button>

              <button
                className="w-1/2 bg-red-500 rounded-md text-white"
                onClick={handleClickNotInterested}
              >
                <p className="m-1">Not Interested</p>
              </button>
            </div>
          )}
        </div>
      </div>

      {isViewingTeams ? (
        <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-2">
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
