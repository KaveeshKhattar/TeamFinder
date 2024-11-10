import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../landingPage/components/Header";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { BASE_URL } from "../../../config";

function ChangePassword() {
    const location = useLocation();
    const email = location.state?.email || "N/A";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onHandleSubmit = async () => {
        
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
          }

        const response = await axios.post(`${BASE_URL}/auth/updatePassword`, {
            email: email,
            password: confirmPassword
        })

        if (response.status === 200) {
            navigate("/login")
        }
    }

    return (
        <>
        <Header></Header>
        <div className="space-y-4">
            <p>{email}</p>
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

            <Button onClick={onHandleSubmit}>
                Change Password
            </Button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

        </div>
        </>
    );
}

export default ChangePassword;