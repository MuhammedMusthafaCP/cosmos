import axios from "axios";
import { API_URL } from "../config";

// withCredentials is required so the browser sends the auth cookie and accepts the cookie-clearing response.
export default function useLogout() {
  return async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
    } catch (err) {
      console.error("Error while logging out", err);
    } finally {
      window.location.assign("/HomePage");
    }
  };
}
