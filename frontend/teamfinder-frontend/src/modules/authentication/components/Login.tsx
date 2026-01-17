import axios from "axios";
import { SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../core/hooks/useAuth";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { BASE_URL } from "../../../config";
import startTokenRefreshTimer from "../../../refreshtoken";
import Header from "../../landingPage/components/Header";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/login`,
                {
                    email,
                    password,
                }
            );
            const { success, message, data } = response.data;
            if (success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("role", response.data.data.role);
                startTokenRefreshTimer();
                signIn();
                navigate("/launch", { state: { email } });
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
        setLoading(false);
    };

    return (
        <>
            <div className="flex h-screen">
                
                <div className="bg-gradient-to-br from-sky-100 to-sky-500 dark:from-sky-600 dark:to-sky-900 h-full w-1/2 flex flex-col justify-center items-center">
                    <p className="text-white text-6xl">teamfinder</p>
                </div>

                <div className="h-full w-1/2 flex flex-col justify-center items-center">
                    <>
                        <p className="mt-8 text-xl text-left">Log In</p>

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
                                {
                                    loading ?
                                        <Button disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                        </Button>
                                        :
                                        <Button>
                                            Submit
                                        </Button>
                                }
                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </form>
                        
                        <div className="flex space-x-4 ">
                            
                            <Link to="/signup">
                                <Button variant="link" className="bg-inherit underline">Sign Up</Button>
                            </Link>


                            <Link to="/changePasswordVerify" state={{ email }}>
                                <Button variant="link" className="bg-inherit underline">Forgot Password</Button>
                            </Link>
                            
                        </div>
                    </>
                </div>
            </div>

            {/* <div className="flex flex-col justify-start items-center min-h-screen">

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
                        {
                            loading ?
                                <Button disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </Button>
                                :
                                <Button>
                                    Submit
                                </Button>
                        }
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                <p className="md:text-xl">
                    Don't have an account? Sign up{" "}
                    <Link to="/signup">
                        <span className="text-blue-500">here.</span>
                    </Link>
                </p>
                <p className="md:text-xl mt-2">
                    Forgot Password?{" "}
                    <Link to="/changePasswordVerify" state= {{email}}>
                        <span className="text-blue-500">Click here.</span>
                    </Link>
                </p>
            </div> */}
        </>
    );
}

export default Login;
