import { useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface Member {
  id: number;        
  firstName: string;
  lastName: string;
  email: string;
}

interface Team {
  name: string;
  eventId: number;
}

function MakeTeam() {

  const [teamName, setTeamName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPeople, setFilteredPeople] = useState<Member[]>([]);
  const [divVisible, setDivVisible] = useState(false);
  const [members, setMembers] = useState<Member[]>([])

  const location = useLocation();
  const { eventID } = location.state;

  // const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const value = e.target.value;
    setSearchTerm(value);
    

    // Filter people by name
    if (value) {
      setDivVisible(true);

      const response = await axios.get(`http://localhost:8080/users/searchUsersByFirstName`, {
        params: {
            name: searchTerm
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
      }
    )
    
    setFilteredPeople(response.data);

    } else {
      setDivVisible(false); // Hide the dropdown if input is empty
      setFilteredPeople([]);
    }
  };

  const setSelfToMembers = useCallback(async () => {

    try {
      const response = await axios.get(
        "http://localhost:8080/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { firstName, lastName, email, id } = response.data;
        const member: Member = { firstName, lastName, email, id };
        
        setMembers([member])
      }
    } catch (err) {
      console.log(err, "Assigning self to members list failed!");
    }
  }, [token]);

  const addMember = (person: Member) => {
    // Check if the member is already in the list
    if (!members.some((member) => member.id === person.id)) {
      setMembers((prevMembers) => [...prevMembers, person]);
    }
  };

  const removeMember = (id: number) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
  };


  useEffect(() => {
    setSelfToMembers();
  }, [setSelfToMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const team: Team = { name: teamName, eventId: eventID };
    try {
      const response = await axios.post(
        'http://localhost:8080/api/teams/createTeam',  // API endpoint
        team,  // This is the request body (team object)
        {
          headers: {
            Authorization: `Bearer ${token}`  // Correct placement of headers
          }
        }
      );
        
        if (response.status === 200) {
          const teamId = response.data.id;

          // Call the function to map users to the newly created team
          await createUserTeamMappings(teamId);
        }
    } catch (err) {
        console.log(err, "Making a team failed!")
    }
  }

  const createUserTeamMappings = async (teamId: number) => {

    const user_ids = members.map((member) => member.id);

    try {

        const response = await axios.post(
          "http://localhost:8080/api/teams/createUserTeamMappings",
          {
            teamId: teamId,
            userIds: user_ids
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass authorization token
            }
          }
        );

        if (response.status === 200) {
          console.log(`User ${user_ids} added to team ${teamId}:`, response.data);
        } else {
          console.log("Fail");
        }
      
    } catch (error) {
      console.error('Error adding users to the team:', error);
    }
  }

  return (
    <>
      <Header title="Make a Team"></Header>

        <div className="flex flex-col ">
            <div className="flex border-2 bg-slate-100 rounded-md">
            <i className="fa-solid fa-magnifying-glass m-2 text-black "></i>
            <input
                type="text"
                placeholder="Search People..."
                className="bg-slate-100 text-black w-full"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            </div>

            {/* Dropdown for filtered people */}
            {divVisible && (
              <div className=" w-full border-2 border-gray-300 mt-2 dark:bg-zinc-600 bg-slate-100 text-black dark:text-white rounded-md">
                
                {filteredPeople.length > 0 ? (
                  filteredPeople.map((person: Member) => {

                    return (
                      <div
                      key={`${person.id}-${person.firstName}`}
                      className="flex justify-between items-center p-2"
                      // Add onClick handler to handle selection if needed
                    >
                      <p> {person.firstName} {person.lastName} </p>

                      <button className="flex items-center p-1 text-white dark:text-black bg-green-500" type="button" onClick={() => addMember(person)}>
                        <i className="fa-solid fa-plus p-1"></i>
                        <p>Add</p>
                      </button>
                       
                    </div>
                    )
                  })
                ) : (
                  <div className=" p-2">No results found</div>
                )}
              </div>
            )}

            <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} required placeholder="Team Name"/>

            <div className="flex flex-col p-2">
              <p className="text-left text-xl p-1">Members:</p>
              
              
              {members.map((member: Member) => {
                return (
                  <div key={`${member.id}-${member.email}`} className="flex justify-between items-center mb-4 p-2">
                    <p>{member.firstName} {member.lastName}</p>
                    
                      <button className="flex items-center p-1 text-white dark:text-black bg-red-500" type="button" onClick={() => removeMember(member.id)}>
                        <i className="fa-solid fa-minus p-1"></i>
                        <p>Remove</p>
                      </button>
                  </div>
                )
              })}
            </div>

            <button className="p-2 dark:bg-zinc-600 bg-slate-100" onClick={handleSubmit}>
              <input type="submit" />
            </button>

        </div>


    </>
  );
}

export default MakeTeam;
