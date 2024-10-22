import { useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

function Verification() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "N/A";
    const [verificationCode, setVerificationCode] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
    
            try {
                const response = await axios.post('http://localhost:8080/auth/verify', {
                    email, verificationCode
                });            
                
                if (response.status === 200) {
                    navigate('/login');
                }
            } catch (err) {
                console.log(err, "Not Verified")
            }
        }

    return(
        <>
        <Header title="Verification"></Header>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <p className="text-2xl m-2">Verification code has been sent to: <span className="font-bold text-blue-500">{email}</span></p>
                <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="m-2 p-2" placeholder="Enter Verification Code"/>
                <button><input type="submit" className="m-2"/></button>
            </form>
        </>
    )
}

export default Verification;