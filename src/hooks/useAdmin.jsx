import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
        enabled: !!user && !loading, // Prevents query from running until user is available
        queryKey: ['admin', user?.email],
        queryFn: async () => {
            const result = await axiosSecure.get(`/users/admin/${user.email}`, {
                withCredentials: true
            });
            return result.data.admin;
        },
    });

    return { isAdmin, isAdminLoading };
};

export default useAdmin;
