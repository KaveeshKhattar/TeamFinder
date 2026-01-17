import { SetStateAction, useCallback, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profilePic from "../assets/blank-profile-picture-973460_1280.webp";
import { useAuth } from "../../core/hooks/useAuth";
import { Team } from "../../../types";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "./Modal";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
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
import { BASE_URL } from "../../../config";
import { Skeleton } from "../../../components/ui/skeleton";
import TeamCardProfile from "./TeamCardProfile";

function Profile() {
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [profilePicUrl, setProfilePicUrl] = useState(profilePic);
  const [profileTeams, setProfileTeams] = useState<Team[]>([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
          `${BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const { firstName = "", lastName = "", id, email = "" } = response.data;

          // Set state with the fetched data
          setUserId(id);
          setFirstName(firstName);
          setLastName(lastName);
          setEmail(email);
        }
      } catch (err) {
        console.log(err, "Fetching user failed.");
      }
    };

    fetchUser();
  }, []);

  

  const saveChanges = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (isEditing) {
      try {
        const response = await fetch(`${BASE_URL}/users/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email
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
    setLoading(true);
    if (userId) {
      // Ensure userId is set
      try {
        const token = localStorage.getItem("token");
        const responseTeams = await axios.get(
          `${BASE_URL}/api/teams/profile`,
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const updateProfilePic = (imgSrc: SetStateAction<string>) => {
    setProfilePicUrl(imgSrc);
  };

  const deleteProfilePicture = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/users/deleteProfilePicture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setProfilePicUrl(profilePic);
    try {
      await axios.delete(`${BASE_URL}/users/deleteImageURL`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfilPic = async () => {

    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}/users/fetchProfilePic`,
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

  if (loading) {
    return (
      <>
        <Header />        
        <div className="flex flex-col justify-center items-center space-x-4 min-h-screen">
          <Skeleton className="h-[150px] w-[150px] rounded-full mb-16" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-2 h-full">
            <Card className="w-[300px] mt-4">
              <CardHeader>
                <Skeleton className="mt-8 h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col text-left text-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-left text-lg mt-2">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                
              </CardFooter>
            </Card>

            <Card className="w-[300px] mt-4">
              <CardHeader>
                <Skeleton className="mt-8 h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col text-left text-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-left text-lg mt-2">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                
              </CardFooter>
            </Card>

            </div>
          </div>
        </div>
      </>
    )
  }

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
                      <p className="text-sm text-muted-foreground">Max Size: 2MB</p>
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

        <form className="mt-4 w-full">
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

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

            {(
                <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-2 h-full">
                {profileTeams.length > 0 ? (
                  profileTeams.map((profileTeam) => (
                    <TeamCardProfile
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
