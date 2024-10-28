import { SetStateAction, useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profilePic from "../assets/blank-profile-picture-973460_1280.webp";
import { useAuth } from "../../core/hooks/useAuth";
import { Team } from "../../../types";
import TeamCard from "../../teams/components/TeamCard";
// import Crop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from "./Modal";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState(0);
  const [profilePicUrl, setProfilePicUrl] = useState(profilePic);
  // const [teamIds, setTeamIds] = useState<number[]>([]);
  const [profileTeams, setProfileTeams] = useState<Team[]>([]);
  const [isRep, setIsRep] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { signOut } = useAuth();
  const navigate = useNavigate();


  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("token");
    localStorage.setItem("isSignedIn", "false");
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }

  })

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {

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

          const { firstName = "", lastName = "", id } = response.data;

          // Set state with the fetched data
          setUserId(id);
          setFirstName(firstName);
          setLastName(lastName);
        }
      } catch (err) {
        console.log(err, "Sign up failed!");
      }
    };

    fetchUser();
  }, []);

  const checkIfRep = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8080/users/checkIfRepProfile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setIsRep(response.data);
  }

  useEffect(() => {
    checkIfRep();
  }, [])

  const [isEditing, setIsEditing] = useState(false);

  const saveChanges = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (isEditing) {
      try {

        const response = await fetch('http://localhost:8080/users/update', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
          })
        });

        if (response.status === 200) {

          setIsEditing(false); // Toggle edit mode after a successful update
        } else {
          console.error("Failed to update user:", await response.text());
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      setIsEditing(true); // Enable editing if not currently in edit mode
    }
  };

  const fetchTeams = useCallback(async () => {
    if (userId) {  // Ensure userId is set
      try {
        const token = localStorage.getItem('token');
        const responseTeams = await axios.get(
          "http://localhost:8080/api/teams/profile",
          {
            params: { userId: userId },
            headers: {
              Authorization: `Bearer ${token}` // Include the JWT token
            }
          }
        );
        if (responseTeams.status === 200) {
          setProfileTeams(responseTeams.data);
          // localStorage.setItem("profileTeams", JSON.stringify(profileTeams));
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
  }, [userId])

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams])

  useEffect(() => {
    if (profileTeams.length) {
      localStorage.setItem("profileTeams", JSON.stringify(profileTeams));
    }
  }, [profileTeams]);

  // const profilePic = useRef("frontend/teamfinder-frontend/src/modules/profile/assets/profile-pic.jpg");
  const updateProfilePic = (imgSrc: SetStateAction<string>) => {
    setProfilePicUrl(imgSrc);
  }


  return (
    <>
      <Header title="Profile" />

      <div className="flex flex-col items-center">

        <div className="relative flex flex-col justify-center items-center">
          <img src={profilePicUrl} alt="" className="rounded-full h-[150px] mb-8" />
          {/* <input type="file" className="border-2 border-black"/> */}
          <button className="p-2" onClick={() => setModalOpen(true)}>Upload Profile Picture</button>
        </div>

        {modalOpen && (
        <Modal updateProfilePic={updateProfilePic} closeModal={() => setModalOpen(false)}/>
      )}

        <form className="mt-4">

          <div className="flex flex-col justify-center items-center w-64 md:w-96">

            <div className="edit-first-name mb-2">
              {isEditing ? (
                <div className="flex justify-center items-center">
                  <p className="mr-2">First Name: </p>
                  <input
                    className="p-2 rounded-md dark:bg-zinc-800 bg-slate-100"
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <p className="mr-2">First Name: </p>
                  <p className="p-2 rounded-md">{firstName}</p>
                </div>
              )}
            </div>

            <div className="edit-last-name mb-2">
              {isEditing ? (
                <div className="flex justify-center items-center">
                  <p className="mr-2">Last Name: </p>
                  <input
                    className="p-2 rounded-md dark:bg-zinc-800 bg-slate-100"
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <p className="mr-2">Last Name: </p>
                  <p className="mr-2 p-2 rounded-md">{lastName}</p>
                </div>
              )}
            </div>

            <button onClick={saveChanges} className="mt-4 p-2 w-full">
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>

            <button onClick={handleSignOut} type="button" className="mt-4 p-2 w-full text-red-500">
              Sign Out
            </button>

            {!isRep && <div className="w-full mt-4">
              <p className="text-2xl font-bold">Teams:</p>
              {profileTeams.length > 0 ? (
                profileTeams.map((profileTeam) => (
                  <TeamCard key={profileTeam.teamId} team={profileTeam} location={`${location.pathname}`} />
                ))
              ) : (
                <p className="text-lg text-gray-500">No teams created.</p>
              )}
            </div>}

          </div>
        </form>
      </div>
    </>

  );
}

export default Profile;