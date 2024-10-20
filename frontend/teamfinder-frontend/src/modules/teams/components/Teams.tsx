import { Link, useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useEffect, useState } from "react";
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

// interface TeamMember {
//     teamId: number;
//     userId: number;
// }

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  // const[teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { eventId } = location.state;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTeams = async () => {
      try {
        console.log("Fetching Teams");
        console.log(`Request URL: http://localhost:8080/api/events/${eventId}`);
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
        setError("Error fetching events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [eventId]);

  // const mergedTeams = teams.map((team, index) => {
  //         return {
  //             ...team,
  //             members: teamMembers[index] // Adding members to the corresponding team
  //         };
  //     });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  return (
    <>
      <Header title="Teams"></Header>

      <div className="flex flex-col ">
        <div className="flex border-2 bg-slate-100 rounded-md">
          <i className="fa-solid fa-magnifying-glass m-2 text-black "></i>
          <input
            type="text"
            placeholder="Search Teams..."
            className="bg-slate-100 w-full"
          />
        </div>

        <div>
          <button className="flex justify-center items-center mt-2 p-2 border-1 border-black dark:border-white w-full ">
            <p className="m-1">Make a Team</p>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-4 gap-2">
        {teams.map((team) => {
          const formattedName = team.teamName
            ? team.teamName.replace(/\s+/g, "-")
            : team.teamName;

          const teamUrl = formattedName.toLowerCase();

          return (            
              <div key={team.teamId} className="flex flex-col rounded-md text-black dark:text-white dark:bg-zinc-600 bg-slate-100">
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

                  <Link className="w-full p-2 m-2 text-black dark:text-white border-2 dark:border-white border-text-black rounded-md" to={`${location.pathname}/${teamUrl}`} state={{ team: team }} >
                    View Details
                  </Link>
                </div>
              </div>
          );
        })}
      </div>
    </>
  );
}

export default Teams;
