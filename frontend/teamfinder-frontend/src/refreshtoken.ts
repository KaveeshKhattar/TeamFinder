import axios from "axios";
import { BASE_URL } from "./config";

// Function to decode JWT and check if it is near expiration
function isTokenNearExpiration(token: string | null): boolean {
    if (!token) return true; // If no token, consider it expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();

    // Return true if the token will expire in the next 1 minute
    return currentTime > expirationTime - 180000;
}

// Background function to periodically check and refresh token
function startTokenRefreshTimer(interval = 1680000) {
    setInterval(async () => {
        console.log("Started token refresh check");

        const accessToken = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (isTokenNearExpiration(accessToken) && refreshToken) {
            try {
                const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
                    refreshToken: refreshToken
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    const data = response.data;
                    const newAccessToken = data.accessToken;

                    // Update localStorage with the new access token
                    localStorage.setItem('token', newAccessToken);
                    console.log('Access token updated in the background.');
                } else {
                    console.error('Failed to refresh access token in the background');
                    // Optionally, trigger logout or notify the user
                }
            } catch (error) {
                console.error('Error refreshing access token in the background:', error);
            }
        }
    }, interval); // Run the check at the specified interval
}

export default startTokenRefreshTimer;