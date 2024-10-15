import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../../landingPage/components/Header";

function Signup() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const [emailExists, setEmailExists] = useState(null);

    useEffect(() => {
        if (email) {
            // Create a debounce effect to avoid making too many API calls
            const delayDebounceFn = setTimeout(() => {
                checkEmailExists(email);
            }, 500); // Delay of 500ms after user stops typing

            return () => clearTimeout(delayDebounceFn);  // Cleanup the timeout on every re-render
        }
    }, [email]);

    const checkEmailExists = async (email: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/auth/check-email?email=${email}`);
            setEmailExists(response.data.exists);  // Assuming the backend returns { exists: true/false }
        } catch (err) {
            console.error('Error checking email:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log(firstName, lastName, username, email, password, role)
            const response = await axios.post('http://localhost:8080/auth/signup', {
                firstName, lastName, username, email, password, role
            });            
            
            if (response.status === 200) {
                navigate('/verification', { state: { email } });
            }
        } catch (err) {
            console.log(err, "Sign up failed!")
        }
    }

    return (
        <>
        <Header></Header>
        <div className="flex flex-col">
        <h2 className="text-4xl">Sign Up</h2>
            <form className="mt-4" onSubmit={handleSubmit}>
                <select className="p-2" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Select Role</option>
                    <option value="STUDENT">Student</option>
                    <option value="REPRESENTATIVE">Representative</option>
                </select>
                <div className="flex flex-col m-4">
                    
                    <input className="m-2 p-2" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="First Name"/>
                    
                    <input className="m-2 p-2" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Last Name"/>
                    
                    <input className="m-2 p-2" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username"/>
                    
                    <input className={`p-2 m-2 rounded-md border-2 
                        ${emailExists === null ? 'border-transparent'
                        : emailExists ? 'border-red-500' 
                        : 'border-green-500'}
                    `} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="abc@xyz.com"/>
                    
                    {emailExists === true && <p className="text-red-500 mt-1">Email already exists</p>}
                    {emailExists === false && <p className="text-green-500 mt-1">Email is available</p>}
                    
                    <input className="m-2 p-2" type="password" placeholder="Password"/>
                    
                    <input className="m-2 p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Confirm Password"/>

                    <button disabled={emailExists === true}><input type="submit"/></button>
                </div>
                <p>Already have an account? Log in <a href="/login">here.</a></p>
            </form>

        </div>        
        </>
    )
}

export default Signup;