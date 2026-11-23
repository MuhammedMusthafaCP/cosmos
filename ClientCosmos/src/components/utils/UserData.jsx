import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../config";

const useUserData = () => {
  const [user, setUser] = useState(null);
  const [valid, setValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserdata = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/users/getAsingleUser/${id}`
      );
      setUserData(response.data);
    } catch (err) {
      console.log("Error while getting the profile data", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/users/tokenvalidate`,
          {},
          { withCredentials: true }
        );
        const { user, valid } = response.data;
        setUser(user);
        if (user) {
          getUserdata(user._id);
        }
        setValid(valid);
      } catch (error) {
        Cookies.remove("token");
        console.error("Error in post request", error.response?.data ?? error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, valid, userData, loading, error, setLoading, setUserData };
};

export default useUserData;
