import { SetStateAction, useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profilePic from "../assets/blank-profile-picture-973460_1280.webp";
import { useAuth } from "../../core/hooks/useAuth";
import { Team } from "../../../types";
import TeamCard from "../../teams/components/TeamCard";
// import Crop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import Modal from "./Modal";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { DialogFooter } from "../../../components/ui/dialog";

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

  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signOut();
    localStorage.removeItem("token");
    localStorage.setItem("isSignedIn", "false");
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "teamfinder-production.up.railway.app/users/profile",
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
    const response = await axios.get(
      "teamfinder-production.up.railway.app/users/checkIfRepProfile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setIsRep(response.data);
  };

  useEffect(() => {
    checkIfRep();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const saveChanges = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (isEditing) {
      try {
        const response = await fetch("teamfinder-production.up.railway.app/users/update", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
          }),
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
    if (userId) {
      // Ensure userId is set
      try {
        const token = localStorage.getItem("token");
        const responseTeams = await axios.get(
          "teamfinder-production.up.railway.app/api/teams/profile",
          {
            params: { userId: userId },
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
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
  }, [userId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);


  // const profilePic = useRef("frontend/teamfinder-frontend/src/modules/profile/assets/profile-pic.jpg");
  const updateProfilePic = (imgSrc: SetStateAction<string>) => {
    setProfilePicUrl(imgSrc);
  };

  const deleteProfilePicture = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("teamfinder-production.up.railway.app/users/deleteProfilePicture", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setProfilePicUrl(profilePic);
    try {
      await axios.delete("teamfinder-production.up.railway.app/users/deleteImageURL", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfilPic = async () => {
    console.log("Fetching profile pic...");
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "teamfinder-production.up.railway.app/users/fetchProfilePic",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data === "Fail") {
      setProfilePicUrl(profilePic);
    } else {
      setProfilePicUrl(response.data);
    }
  };

  useEffect(() => {
    fetchProfilPic();
  }, []);

  return (
    <>
      <Header />

      <div className="flex flex-col items-center min-h-screen dark:bg-black bg-white">
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            src={profilePicUrl}
            alt=""
            className="rounded-full h-[150px]"
          />
          {/* <input type="file" className="border-2 border-black"/> */}

          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-zinc-700">
                <div className="flex items-center p-2 bg-zinc-700 text-white rounded-md">
                  <i className="fa-solid fa-pen"></i>
                  <p className="p-1">Edit Picture</p>
                  </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setModalOpen(true)}>
                  <Button>
                    <div className="">
                    <p>Upload Profile Picture</p>
                    <p className="text-sm text-muted-foreground">Max Size: 5MB</p>
                    </div>                  
                  </Button>                  
                    
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteProfilePicture}>
                    <Button variant="destructive">
                    Delete Profile Picture
                    </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {modalOpen && (
          <Modal
            updateProfilePic={updateProfilePic}
            closeModal={() => setModalOpen(false)}
          />
        )}

        <form className="mt-4">
          <div className="flex flex-col justify-center items-center">
            <div className="edit-first-name mb-2">
              <div className="flex items-center">
                <Label htmlFor="firstName" className="mr-2">
                  First Name:
                </Label>
                <p className="p-2 rounded-md">{firstName}</p>
              </div>
            </div>

            <div className="edit-last-name mb-2">
              <div className="flex items-center">
                <Label htmlFor="lastName" className="mr-2">
                  Last Name:
                </Label>
                <p className="p-2 rounded-md">{lastName}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstName" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastName" className="text-right">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={saveChanges}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={handleSignOut} variant="destructive">
                Sign Out
              </Button>
            </div>

            {!isRep && (
              <div className="w-full mt-4">
                {profileTeams.length > 0 ? (
                  profileTeams.map((profileTeam) => (
                    <TeamCard
                      key={profileTeam.teamId}
                      team={profileTeam}
                      location={`${location.pathname}`}
                    />
                  ))
                ) : (
                  <p className="text-lg text-gray-500">No teams created.</p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default Profile;
