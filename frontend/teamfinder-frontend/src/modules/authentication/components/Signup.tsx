import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

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
      const response = await axios.post("https://teamfinder-production.up.railway.app/auth/signup", {
        role,
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
        setError("Incorrect Credentials: " + message);
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
      <Header></Header>

      <div className="flex flex-col justify-start items-center min-h-screen">
        <p className="mt-8 text-lg font-bold">
          Your next event is <br />
          just a sign up away.
        </p>

        <form className="mt-4 mb-4 w-full md:w-2/5" onSubmit={handleSubmit}>
          <select
            className="p-2 border-2 bg-white dark:bg-zinc-700 border-zinc-300 dark:border-slate-600 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="STUDENT">Student</option>
            <option value="REPRESENTATIVE">Representative</option>
          </select>
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

          <p className="md:text-xl">
            Already have an account? Log in{" "}
            <Link to="/login">
              <span className="text-blue-500">here.</span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
