import { Link, useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Member, Team } from "../../../types";
import TeamsList from "./TeamsList";
import IndividualList from "./IndividualList";
import SearchBar from "../../core/components/SearchBar";
import { Button } from "../../../components/ui/button";
import { BASE_URL } from "../../../config";
import { Skeleton } from "../../../components/ui/skeleton";
import LoadingTeams from "./LoadingTeams";

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIndividuals, setLoadingIndividuals] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isViewingTeams, setisViewingTeams] = useState<boolean>(true);
  const [individuals, setIndividuals] = useState<Member[]>([]);
  const [userId, setUserId] = useState(0);
  const [isPartOfAnyTeam, setIsPartOfAnyTeam] = useState(false);
  const [IsUserInterestedAlreadyBool, setIsUserInterestedAlreadyBool] = useState<boolean>();

  const location = useLocation();
  const { eventId, eventURL } = location.state;

  const fetchInterestedIndividuals = async () => {
    try {
      setLoadingIndividuals(true);
      const response = await axios.get(
        `${BASE_URL}/api/events/${eventId}/InterestedIndividuals`,
      );

      setIndividuals([...response.data]);
      setLoadingIndividuals(false);
      setIsUserInterestedAlreadyBool(
        individuals.some((individual) => individual.id === userId)
      );
      console.log("INDIVID bool: ", IsUserInterestedAlreadyBool);
    } catch (err) {
      setError("Error fetching teams");
      console.error(err);
    } finally {
      console.log("Finally")
    }
  };

  const fetchUserAndCheckMembership = useCallback(async () => {
    const token = localStorage.getItem("token")

    try {
      const profileResponse = await axios.get(
        `${BASE_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (profileResponse.status === 200) {
        const fetchedUserId = profileResponse.data.id;
        setUserId(fetchedUserId);
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
        `${BASE_URL}/api/isPartOfAny`,
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
    const token = localStorage.getItem("token");
    if (!token) {
      setIsPartOfAnyTeam(true);
    } else {
      fetchUserAndCheckMembership(); // Call the combined function on component mount
    }
    console.log("isPart: ", isPartOfAnyTeam);
  }, [fetchUserAndCheckMembership, isPartOfAnyTeam]);

  const fetchTeams = useCallback(async () => {

    try {
      const response = await axios.get(
        `${BASE_URL}/api/events/${eventId}/teams`,
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
        const filteredTeams = teams.filter((team) =>
          team.members.some(
            (member) =>
              member.fullName.toLowerCase().includes(value.toLowerCase())
          )
        );
        console.log("Filtered teams:", filteredTeams);

        setTeams(filteredTeams);
      } catch (error) {
        setError("Error filtering teams: " + error);
      }
    } else {
      await fetchTeams();
    }
  };

  const handleViewingTeamsOrIndividuals = () => {
    setisViewingTeams(!isViewingTeams);
    if (isViewingTeams) {
      fetchInterestedIndividuals();
    } else {
      fetchTeams();
    }    
  };

  const handleClickInterested = async () => {

    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
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
        `${BASE_URL}/api/events/${eventId}/InterestedIndividual`,
        {          
          userId: userId,
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
      const response = await axios.get("https://teamfinder-frontend.vercel.app/users/profile", {
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
        `${BASE_URL}/api/events/${eventId}/InterestedIndividual`,
        {
          params: {
            userID: userId,
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
      const response = await axios.get(`${BASE_URL}/users/profile`, {
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
        `${BASE_URL}/api/events/isUserInterestedAlready`,
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
    const token = localStorage.getItem("token");
    if (!token) {
      setIsUserInterestedAlreadyBool(false);
    } else {
      isUserInterestedAlready(); // Call the combined function on component mount
    }
  }, [isUserInterestedAlready]);

  if (loadingIndividuals) {
    return (
      <>
        <Header />
        <SearchBar
          placeholder="Find teams by your friends' name"
          onChange={handleSearchChange}
        />
        <div className="grid grid-cols-1 space-y-8">
          <div className="flex space-x-4 mt-8 min-h-screen">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <div className="flex space-x-4 mt-8 min-h-screen">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <div className="flex space-x-4 mt-8 min-h-screen">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header></Header>
        <SearchBar onChange={handleSearchChange} />
        <LoadingTeams />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  return (
    <>
      <Header></Header>

      <div className="flex flex-col">
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
              {isPartOfAnyTeam ? (
                <div className="pointer-events-none">
                  <Button className="bg-gray-400 mt-2 w-full" disabled>
                    <p className="m-1">Make a Team</p>
                    <i className="fa-solid fa-plus"></i>
                  </Button>
                </div>
              ) : (
                <Link
                  to={`${location.pathname}/makeTeam`}
                  state={{ eventID: eventId, eventUrl: eventURL }}
                >
                  <Button
                    onClick={handleViewingTeamsOrIndividuals}
                    className="mt-2 w-full"
                  >
                    <p className="m-1">Make a Team</p>
                    <i className="fa-solid fa-plus"></i>
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <div className="flex mt-2 justify-between">
              <button
                className={`w-1/2 mr-2 rounded-md text-white ${localStorage.getItem('token') ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                onClick={handleClickInterested}
              >
                <p className="m-1">Interested</p>
              </button>

              <button
                className={`w-1/2 rounded-md text-white ${localStorage.getItem('token') ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                onClick={handleClickNotInterested}
              >
                <p className="m-1">Not Interested</p>
              </button>
            </div>

          )}
        </div>

      </div>

      {isViewingTeams ? (
        <div className="min-h-screen">
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
