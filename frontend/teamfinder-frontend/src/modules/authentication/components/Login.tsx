import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { useAuth } from "../../core/hooks/useAuth";

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
            
            <form className="mt-4" onSubmit={handleSubmit}>
                
                <div className="flex flex-col m-4 justify-center items-center">                    
                    <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md w-96" type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="abc@xyz.com"/>
                    
                    <input className="m-2 p-2 border-2 border-zinc-300 dark:border-slate-600 rounded-md w-96" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/>
                    
                    <button className="p-2 dark:bg-zinc-600 bg-slate-100 w-96"><input type="submit" /></button>
                </div>
            </form>
            <p>Don't have an account? Sign up <Link to="/signup">here.</Link></p>
        </div>        
        </>
    )
}

export default Login;