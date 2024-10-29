import axios from "axios";
import { SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useAuth } from "../../core/hooks/useAuth";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [role, setRole] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email, password
            });
            
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                signIn();
                navigate("/colleges", {state: { email }});
            }
        } catch (err) {
            console.log(err, "Log in failed!")
        }
    }

    return (
        <>
        <Header title="Login"></Header>
        <div className="flex flex-col">
            <p className="mt-8 text-lg font-bold">Log in to TeamFinder</p>
            <form className="mt-4" onSubmit={handleSubmit}>
                
                <div className="flex flex-col m-4 justify-center items-center gap-1.5">
                    
                    <Input type="email" id="email" placeholder="Email" value={email} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)} required/>

                    <Input type="password" id="password" placeholder="Password" value={password} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)} required/>


                    {/* <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md w-64 md:w-96" type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/> */}
                    
                    {/* <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md w-64 md:w-96" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/> */}
                    
                    {/* <button className="p-2 dark:bg-white dark:text-black w-64 md:w-96 rounded-md"><input type="submit" /></button> */}
                    <Button>Submit</Button>
                </div>
            </form>
            <p className="md:text-xl">Don't have an account? Sign up <Link to="/signup"><span className="text-blue-500">here.</span></Link></p>
        </div>        
        </>
    )
}

export default Login;