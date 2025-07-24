import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

const axiosSecure = axios.create({
    baseURL: 'https://rewaz-server-side.vercel.app',
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