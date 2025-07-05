import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

const useAxiosSecure = () => {
    const { logOut } = useContext(AuthContext);
    useEffect(() => {
        axiosSecure.interceptors.response.use(res => {
            return res;
        }, err => {
            if (err.response.status === 401 || err.response.status === 403) {
                logOut()
                    .then(res => {
                        console.log(res.user);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        })
    }, [])
    return axiosSecure;
}

export default useAxiosSecure;