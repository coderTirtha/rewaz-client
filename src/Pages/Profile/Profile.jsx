import React from 'react';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const Profile = () => {
    const { uid } = useParams();
    const axiosSecure = useAxiosSecure();
    const {data: userProfile, isLoading, refetch} = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${uid}`);
            return res.data;
        },
    });
    return (
        <div>
            <title>{`Profile - Rewaz | ${userProfile?.name}`}</title>
            <div>
                
            </div>
        </div>
    );
};

export default Profile;