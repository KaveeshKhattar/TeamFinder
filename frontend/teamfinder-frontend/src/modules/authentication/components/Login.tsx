import axios from "axios";
import { SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useAuth } from "../../core/hooks/useAuth";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://teamfinder-wpal.onrender.com/auth/login",
                {
                    email,
                    password,
                }
            );

            const { success, message, data } = response.data;
            if (success) {
                localStorage.setItem("token", data.token);
                signIn();
                navigate("/colleges", { state: { email } });
            } else {
                setError("Incorrect Credentials: " + message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "An error occurred.";
                setError(errorMessage);
            } else {
                setError("Unexpected error:" + error);
            }
        }
    };

    return (
        <>
            <Header></Header>
            <div className="flex flex-col justify-start items-center min-h-screen">
                <p className="mt-8 text-lg font-bold">Log in to TeamFinder</p>

                <form className="mt-4 mb-4 w-full md:w-2/5" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center gap-1.5">
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e: { target: { value: SetStateAction<string> } }) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e: { target: { value: SetStateAction<string> } }) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                        <Button>Submit</Button>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
                <p className="md:text-xl">
                    Don't have an account? Sign up{" "}
                    <Link to="/signup">
                        <span className="text-blue-500">here.</span>
                    </Link>
                </p>
            </div>
        </>
    );
}

export default Login;
