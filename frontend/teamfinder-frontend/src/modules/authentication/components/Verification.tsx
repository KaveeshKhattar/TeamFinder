import { useLocation } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { BASE_URL } from "../../../config";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../../../components/ui/input-otp";

function Verification() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "N/A";
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/auth/verify`, {
                email, verificationCode
            });
            const { success, message } = response.data;
            if (success) {
                navigate('/login');
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

            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
                <div className="flex flex-col items-center justify-center scale-125">
                    <p className="text-lg m-2">We've sent a code to: <span className="font-bold">{email}</span></p>
                    <p className="text-lg m-2">The code expires in 15 minutes</p>
                    <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>

                        {/* <Input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="mb-2 " placeholder="Enter Verification Code" /> */}
                        <InputOTP maxLength={6} onChange={(value) => setVerificationCode(value)}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button className="m-2">
                            Submit
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}

export default Verification;