import axios from 'axios';

const axiosPublic = axios.create({
    baseURL: 'https://rewaz-server-side.vercel.app',
    withCredentials: true
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;