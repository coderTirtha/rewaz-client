import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'https://rewaz-server-postgres.onrender.com' : 'https://rewaz-server-postgres.onrender.com');

const axiosPublic = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;