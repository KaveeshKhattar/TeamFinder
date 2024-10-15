import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../landingPage/components/Header";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email, password, role
            });
            
            if (response.status === 200) {
                navigate("/home");
            }
        } catch (err) {
            console.log(err, "Log in failed!")
        }
    }

    return (
        <>
        <Header ></Header>
        <div className="flex flex-col">
        <h2 className="text-4xl">Log In</h2>
            
            <form className="mt-4" onSubmit={handleSubmit}>
                <select className="p-2" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Select Role</option>
                    <option value="STUDENT">Student</option>
                    <option value="REPRESENTATIVE">Representative</option>
                </select>
                
                <div className="flex flex-col m-4">                    
                    <input className="m-2 p-2" type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="abc@xyz.com"/>
                    
                    <input className="m-2 p-2" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/>
                    
                    <button><input type="submit" /></button>
                </div>
            </form>
            <p>Don't have an account? Sign up <a href="/signup">here.</a></p>
        </div>        
        </>
    )
}

export default Login;