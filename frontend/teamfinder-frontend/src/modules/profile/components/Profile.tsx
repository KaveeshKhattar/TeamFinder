import { SetStateAction, useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Skeleton } from "../../../components/ui/skeleton";
import { Camera, Edit2 } from "lucide-react";
import Modal from "./Modal";
import defaultProfilePicture from "../assets/blank-profile-picture-973460_1280.webp";
import Leads from "./Leads";
import { User } from "../../../types";

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePicture);
  const [isLoadingProfilePic, setIsLoadingProfilePic] = useState(true);

  const updateProfilePic = (imgSrc: SetStateAction<string>) => {
    setProfilePicUrl(imgSrc);
  };


  useEffect(() => {
    // Fetch Current User Details
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.log(err, "Fetching user failed.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);
  

  // Fetch Profile Picture
  const fetchProfilePic = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoadingProfilePic(true);
      const response = await axios.get(`${BASE_URL}/users/profilePicture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data === "Fail") {
        setProfilePicUrl(defaultProfilePicture);
      } else {
        setProfilePicUrl(response.data);
      }
    } catch (err) {
      console.log(err);
      setProfilePicUrl(defaultProfilePicture);
    } finally {
      setIsLoadingProfilePic(false);
    }
  };

  useEffect(() => {
    fetchProfilePic();
  }, []);

  // Edit Profile
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpen(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstname"),
      lastName: formData.get("lastname"),
      email: formData.get("email"),
      bio: formData.get("bio"),
      skills: formData.get("skills")?.toString().split(",").map(skill => skill.trim()),
    };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BASE_URL}/users/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  }

  // Delete Profile Picture
  const deleteProfilePicture = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/users/profilePicture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setProfilePicUrl(defaultProfilePicture);
    try {
      await axios.delete(`${BASE_URL}/users/imageURL`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {isLoading ? (
          <>
            {/* Profile Header Card Skeleton */}
            <div className="border border-border rounded-lg bg-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Profile Picture Section Skeleton */}
                <div className="flex flex-col items-center md:items-start">
                  <Skeleton className="rounded-full w-32 h-32 md:w-40 md:h-40" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </div>

                {/* Profile Info Section Skeleton */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>

            {/* Skills Section Skeleton */}
            <div className="border border-border rounded-lg bg-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <Skeleton className="h-6 sm:h-7 w-20 mb-3 sm:mb-4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>

            {/* Leads Section Skeleton */}
            <div className="border border-border rounded-lg bg-card p-4 sm:p-6 md:p-8">
              <Skeleton className="h-7 w-32 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Profile Header Card */}
            <div className="border border-border rounded-lg bg-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col flex-1 space-y-4 text-center md:text-left items-center md:items-start">

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    {isLoadingProfilePic ? (
                      <Skeleton className="rounded-full w-32 h-32 md:w-40 md:h-40" />
                    ) : (
                      <>
                        <img
                          src={user?.pictureURL || profilePicUrl}
                          alt="Profile"
                          className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-2 border-border"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute bottom-0 right-0 rounded-full"
                            >
                              <Camera className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setModalOpen(true)}>
                              Upload Profile Picture
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={deleteProfilePicture} className="text-destructive">
                              Delete Profile Picture
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center md:text-left">
                    Max 5MB
                  </p>
                </div>

                {modalOpen && (
                  <Modal
                    updateProfilePic={updateProfilePic}
                    closeModal={() => setModalOpen(false)}
                  />
                )}

                {/* Profile Info Section */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-semibold mb-1">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>

                  {user?.bio && (
                    <div>
                      <p className="text-foreground leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                      <form onSubmit={onSubmit}>
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="firstname-1">First Name</Label>
                            <Input
                              id="firstname-1"
                              name="firstname"
                              defaultValue={`${user?.firstName || ""}`}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastname-1">Last Name</Label>
                            <Input
                              id="lastname-1"
                              name="lastname"
                              defaultValue={`${user?.lastName || ""}`}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email-1">Email</Label>
                            <Input
                              id="email-1"
                              name="email"
                              defaultValue={`${user?.email || ""}`}
                              type="email"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="bio-1">Bio</Label>
                            <Input
                              id="bio-1"
                              name="bio"
                              defaultValue={`${user?.bio || ""}`}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="skills-1">Skills</Label>
                            <Input
                              id="skills-1"
                              name="skills"
                              placeholder="Comma separated (e.g., React, TypeScript, Node.js)"
                              defaultValue={`${user?.skills?.join(", ") || ""}`}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="border border-border rounded-lg bg-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-md text-sm bg-muted text-muted-foreground border border-border"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills added.</p>
                )}
              </div>
            </div>

            {/* Leads Section */}

            <div className="border border-border rounded-lg bg-card p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Leads (Individuals & Teams)</h2>
              <Leads />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
