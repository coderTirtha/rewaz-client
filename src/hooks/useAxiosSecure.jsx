import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://rewaz-server-side.vercel.app');

const axiosSecure = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

const useAxiosSecure = () => {
    const { logOut } = useContext(AuthContext);
    useEffect(() => {
        const interceptor = axiosSecure.interceptors.response.use(
            res => res,
            err => {
                if (err?.response?.status === 401 || err?.response?.status === 403) {
                    logOut()
                        .then(() => {
                            console.log("User logged out due to unauthorized access.");
                        })
                        .catch(console.error);
                }
                return Promise.reject(err);
            }
        );

        return () => {
            axiosSecure.interceptors.response.eject(interceptor);
        };
    }, []);

    return axiosSecure;
}

export default useAxiosSecure;