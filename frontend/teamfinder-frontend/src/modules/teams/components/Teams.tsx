import { Link, useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../core/components/Loading";
import profilePic from "../assets/profilePic.webp";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
}

interface Team {
  teamId: number;
  teamName: string;
  members: User[];
}

interface UserProjection {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewingTeams, setisViewingTeams] = useState<boolean>(true);
  const [individuals, setIndividuals] = useState<UserProjection[]>([]);

  const location = useLocation();
  const { eventId, eventURL } = location.state;

  const fetchInterestedIndividuals = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/events/fetchIndividuals/${eventId}`,
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
        `http://localhost:8080/api/events/${eventId}`,
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
    let id = 0;
    try {
      const response = await axios.get("http://localhost:8080/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        id = response.data.id;
      }
    } catch (err) {
      console.log(err, "Sign up failed!");
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/events/createIndividual",
        {
          id: id,
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
        <div className="flex border-2 bg-slate-100 rounded-md">
          <i className="fa-solid fa-magnifying-glass m-2 text-black "></i>
          <input
            type="text"
            placeholder="Search Teams..."
            className="bg-slate-100 w-full"
            onChange={handleSearchChange}
          />
        </div>

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
              className="flex justify-center items-center mt-2 p-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md border-1 border-black dark:border-white w-full"
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
          {teams.map((team) => {
            const teamName = team.teamName || "";
            const formattedName = teamName.replace(/\s+/g, "-");
            const teamUrl = formattedName.toLowerCase();

            return (
              <div
                key={team.teamId}
                className="flex flex-col rounded-md text-black dark:text-white dark:bg-zinc-600 bg-slate-100"
              >
                <div className="card flex justify-between">
                  <div className="card-left flex w-1/2 flex-col items-start p-2">
                    <div className="text-xl w-full text-left font-bold">
                      {team.teamName}
                    </div>
                  </div>

                  <div className="card-right w-1/2 flex flex-col ">
                    <ul>
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center mb-2 p-2"
                        >
                          <img
                            className="w-10 mr-2 rounded-full"
                            src={profilePic}
                            alt=""
                          />
                          <p className="">
                            {member.firstName} {member.lastName}
                          </p>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-around border-dotted border-t-2 border-gray-400">
                  {/* <Link className="w-full p-2 m-2 text-black dark:text-white border-2 dark:border-white border-text-black rounded-md" to={`${location.pathname}/${teamUrl}`} >
                    Join Team
                  </Link> */}

                  <Link
                    className="w-full p-2 m-2 text-black dark:text-white border-2 dark:border-white border-text-black rounded-md"
                    to={`${location.pathname}/${teamUrl}`}
                    state={{ team: team }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {individuals.map((individual) => {
            return (
              <div className="flex mt-4 justify-between" key={individual.id}>
                <p>
                  {individual.firstName} {individual.lastName}
                </p>
                <p>{individual.email}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Teams;
