import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://rewaz-server-side.vercel.app');

const axiosPublic = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;