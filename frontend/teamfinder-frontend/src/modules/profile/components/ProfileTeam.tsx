import { useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Member } from "../../../types";
import SearchBar from "../../core/components/SearchBar";

function ProfileTeam() {

  const [teamName, setTeamName] = useState("");

  const [filteredPeople, setFilteredPeople] = useState<Member[]>([]);
  const [divVisible, setDivVisible] = useState(false);
  const location = useLocation();
  const { team } = location.state;
  const eventID = team.eventId;
  const [members, setMembers] = useState<Member[]>(team.members)



  const navigate = useNavigate();
  const token = localStorage.getItem("token");



  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;


    // Filter people by name
    if (value) {
      setDivVisible(true);

      const response = await axios.get(`http://localhost:8080/users/searchUsersByFullName`, {
        params: {
          name: value
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


  const addMember = (person: Member) => {
    // Check if the member is already in the list
    if (!members.some((member) => member.id === person.id)) {
      setMembers((prevMembers) => [...prevMembers, person]);
    }
  };

  const removeMember = (id: number) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTeam = { name: teamName, eventId: eventID };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/teams/team/${team.teamId}`,  // API endpoint with team ID in the URL
        updatedTeam,  // This is the request body (team object)
        {
          headers: {
            Authorization: `Bearer ${token}`  // Authorization headers
          }
        }
      );

      if (response.status === 200) {
        const teamId = response.data.id;

        // Call the function to map users to the newly created team
        await createUserTeamMappings(teamId);
        navigate("/");
      }
    } catch (err) {
      console.log(err, "Making a team failed!")
    }
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make the DELETE request to the API endpoint with the team ID in the URL
      const response = await axios.delete(
        `http://localhost:8080/api/teams/team/${team.teamId}`,  // API endpoint with team ID
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Authorization headers
          }
        }
      );
    
      // Check if the response indicates a successful deletion
      if (response.status === 200) {

        
        // Optionally, you can navigate to another page or perform other actions
        navigate("/");
      }
    } catch (err) {
      console.error(err, "Deleting the team failed!");  // Improved error logging
    }
        
  }

  const createUserTeamMappings = async (teamId: number) => {
    
    const user_ids = members.map((member) => member.id);


    try {

      await axios.put(
        "http://localhost:8080/api/teams/userTeamMappings",
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

    } catch (error) {
      console.error('Error adding users to the team:', error);
    }
  }

  return (
    <>
      <Header title="Edit Team"></Header>

      <div className="flex flex-col ">
        <SearchBar onChange={handleSearchChange} />

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

        <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md" type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} required placeholder={team.teamName} />

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

        <button className="dark:bg-zinc-600 bg-slate-100 mt-2" onClick={handleDelete}>
          <p className="p-2 text-red-600">Delete</p>
        </button>

      </div>


    </>
  );
}

export default ProfileTeam;
