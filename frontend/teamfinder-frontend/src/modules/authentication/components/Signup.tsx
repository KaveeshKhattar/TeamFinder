import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { BASE_URL } from '../../../../src/config';
import Header from "../../landingPage/components/Header";

function Signup() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        firstName,
        lastName,
        email,
        password
      });
      const { success, message } = response.data;
      if (success) {
        setLoading(false);
        navigate("/verification", { state: { email } });
      } else {
        setError("Something went wrong: " + message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "An error occurred.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occured.");
      }
    }
    setLoading(false);
  };

  return (
    <>
    
      <div className="flex-col">
        <Header />
        <div className="h-full w-full flex flex-col justify-center items-center">
          <p className="mt-8 text-lg font-bold">
            Your next event is just a sign up away.
          </p>

          <form className="mt-4 mb-4 w-full md:w-2/5" onSubmit={handleSubmit}>

            <div className="flex flex-col m-4 gap-1.5">
              <Input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <Input
                type="text"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {loading ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button>Submit</Button>
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <Link to="/login">
              <Button variant="link" className="bg-inherit underline">Log In</Button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
