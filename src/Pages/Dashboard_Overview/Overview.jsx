import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaUsers } from 'react-icons/fa';
import { MdCardMembership } from 'react-icons/md';

const Overview = () => {
    const axiosSecure = useAxiosSecure();
    const { data: users } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const result = await axiosSecure.get('/users', { withCredentials: true });
            return result?.data;
        }
    });
    const { data: members } = useQuery({
        queryKey: ['member'],
        queryFn: async () => {
            const result = await axiosSecure.get('/members', { withCredentials: true });
            return result?.data;
        }
    })
    return (
        <div className='w-full px-4'>
            <title>Overview | Dashboard - Rewaz</title>
            <div className='grid grid-cols-3 gap-2 w-full'>
                <div className='rounded-lg shadow-lg p-6 flex justify-center items-center'>
                    <div className='w-full'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-5xl font-bold text-[#E97451]'>{users?.length}</h1>
                            <FaUsers className='text-5xl' />
                        </div>
                        <h5>Total Users</h5>
                    </div>
                </div>
                <div className='rounded-lg shadow-lg p-6 flex justify-center items-center'>
                    <div className='w-full'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-5xl font-bold text-[#E97451]'>{members?.length}</h1>
                            <MdCardMembership className='text-5xl' />
                        </div>
                        <h5>Total Members</h5>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    );
};

export default Overview;