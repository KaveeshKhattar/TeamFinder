import { useEffect, useState } from "react";
import Header from "../../landingPage/components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import profilePic from "../assets/profile-pic.jpg";
import { useAuth } from "../../core/hooks/useAuth";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { signOut } = useAuth();
  const navigate = useNavigate();

  
  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("token");
    localStorage.setItem("isSignedIn", "false");
    navigate("/");
  };

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
          const { firstName = "", lastName = ""} = response.data;

          // Set state with the fetched data
          setFirstName(firstName);
          setLastName(lastName);
        }
      } catch (err) {
        console.log(err, "Sign up failed!");
      }
    };

    fetchUser();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const saveChanges = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (isEditing) {
      try {
        console.log("sending updated values: ", firstName, lastName);
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
          console.log("User updated successfully");
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

  return (
    <>
      <Header></Header>

      <div className="flex flex-col justify-center items-center ">
        <h2 className="text-2xl">Manage Your Profile</h2>
      </div>

      <div className="flex flex-col">
        <form className="mt-4">
          <div className="flex flex-col m-4 justify-center items-center">
            
            <div className="edit-first-name mb-2">
              {isEditing ? (
                <div className="flex justify-center items-center">
                  <p className="mr-2">First Name: </p>
                  <input
                    className="p-2 rounded-md bg-slate-100"
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
                  <p className="bg-slate-50 p-2 rounded-md">{firstName}</p>
                  
                </div>
              )}
            </div>

            <div className="edit-last-name mb-2">
              {isEditing ? (
                
                <div className="flex justify-center items-center">
                  <p className="mr-2">Last Name: </p>
                  <input
                    className="p-2 rounded-md bg-slate-100"
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
                  <p className="mr-2 bg-slate-50 p-2 rounded-md">{lastName}</p>
                </div>
              )}
            </div>

            <button
              onClick={saveChanges}
              className="mt-4 p-2 w-full"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>

            <button
              onClick={handleSignOut}
              className="mt-4 p-2 w-full text-red-500"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Profile;
