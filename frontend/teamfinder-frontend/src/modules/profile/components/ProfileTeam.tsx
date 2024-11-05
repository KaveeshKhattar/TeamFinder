import { SetStateAction, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Member } from "../../../types";
import SearchBar from "../../core/components/SearchBar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { BASE_URL } from "../../../config";

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

  useEffect(() => {
    setTeamName(team.teamName || ""); // Initial default value from team.teamName
  }, [team.teamName]);


  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;


    // Filter people by name
    if (value) {
      setDivVisible(true);

      const response = await axios.get(`${BASE_URL}/users/searchUsersByFullName`, {
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

    const updatedTeam = { name: teamName || team.teamName, eventId: eventID };

    try {
      const response = await axios.put(
        `https://teamfinder-frontend.vercel.app//api/teams/team/${team.teamId}`,  // API endpoint with team ID in the URL
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
        navigate("/profile");
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
        `${BASE_URL}/api/teams/team/${team.teamId}`,  // API endpoint with team ID
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Authorization headers
          }
        }
      );

      // Check if the response indicates a successful deletion
      if (response.status === 200) {


        // Optionally, you can navigate to another page or perform other actions
        navigate("/profile");
      }
    } catch (err) {
      console.error(err, "Deleting the team failed!");  // Improved error logging
    }

  }

  const createUserTeamMappings = async (teamId: number) => {

    const user_ids = members.map((member) => member.id);


    try {

      await axios.put(
        `${BASE_URL}/api/teams/userTeamMappings`,
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
      <Header></Header>

      <div className="flex flex-col relative">
        <SearchBar placeholder="Add People" onChange={handleSearchChange} />

        {/* Dropdown for filtered people */}
        {divVisible && (
          <div className="absolute w-full border-2 border-gray-300 mt-10 bg-white text-black dark:text-white rounded-md mb-2 max-h-[200px] overflow-auto">

            {filteredPeople.length > 0 ? (
              filteredPeople.map((person: Member) => {

                return (
                  <div
                    key={`${person.id}-${person.firstName}`}
                    className="flex justify-between items-center p-2"
                  // Add onClick handler to handle selection if needed
                  >
                    <p> {person.firstName} {person.lastName} </p>

                    <Button className="bg-green-500" onClick={() => addMember(person)}>
                      <i className="fa-solid fa-plus p-1"></i>
                      <p>Add</p>
                    </Button>

                  </div>
                )
              })
            ) : (
              <div className="p-2">No results found</div>
            )}
          </div>
        )}

        

        <div className="flex flex-col ">

          <Card className="mb-2 mt-2">
        <CardHeader>
          <CardTitle className="text-left text-lg">Edit Team</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <p className="mr-2">Team&nbsp;Name: </p>
            <Input value={teamName} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setTeamName(e.target.value)} required  id="teamName" />
          </div>        
          
          <div className="mt-4">
            <p className="text-muted-foreground text-left">Members</p>
          {members.map((member: Member) => {
            return (
              <div key={`${member.id}-${member.email}`} className="flex justify-between items-center mb-2">
                <p>{member.firstName} {member.lastName}</p>

                <Button variant="destructive" onClick={() => removeMember(member.id)}>
                    <i className="fa-solid fa-minus p-1"></i>
                    <p>Remove</p>
                  </Button>
              </div>
            )
          })}
          </div>
        </CardContent>
        </Card>
        </div>
        
        <Button onClick={handleSubmit} className="mb-2">
          Submit
          </Button>

        <Button variant="destructive" onClick={handleDelete}>
          Delete Team
          </Button>

      </div>


    </>
  );
}

export default ProfileTeam;
