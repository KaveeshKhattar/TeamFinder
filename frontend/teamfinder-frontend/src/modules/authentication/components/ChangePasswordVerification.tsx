import { useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { BASE_URL } from "../../../config";

function ChangePasswordVerification() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "N/A";
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const sendEmail = async () => {
            try {
                const response = await axios.post(`${BASE_URL}/auth/changePasswordVerify`, {
                    email: email  // 'email' is now sent in the body as JSON
                });
    
                if (response.status === 200) {
                    console.log("Email sent");
                }
            } catch (error) {
                console.error("Error sending email:", error);
            }
        };

        sendEmail();
    }, [email, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/auth/verify`, {
                email, verificationCode
            });
            const { success, message } = response.data;
            if (success) {
                navigate("/changePassword", { state: { email } });
            } else {
                setError("Incorrect Code: " + message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "An error occurred.";
                setError(errorMessage);
            } else {
                setError("An unexpected error occured.");
            }
        }
    }



    return (
        <>
            <Header></Header>
            <form className="flex flex-col min-h-screen" onSubmit={handleSubmit}>
                <p className="text-2xl m-2">Verification code has been sent to: <span className="font-bold text-blue-500">{email}</span></p>
                <Input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="mb-2 " placeholder="Enter Verification Code" />
                <Button>
                    Submit
                </Button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </>
    )
}

export default ChangePasswordVerification;