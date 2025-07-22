import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ManageMembers = () => {
    const axiosSecure = useAxiosSecure();
    const { data: members = [], refetch } = useQuery({
        queryKey: ['members'],
        queryFn: async () => {
            const result = await axiosSecure.get('/members', { withCredentials: true });
            return result?.data;
        }
    });
    // console.log(members);
    return (
        <div>
            <div className='my-6'>
                <h1 className='text-4xl font-bold text-center'>All Members</h1>
            </div>
            <div className="hidden md:block overflow-x-auto mx-4">
                <table className="table">
                    <thead>
                        <tr>
                            <td>Sl. No.</td>
                            <td>Photo</td>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Phone</td>
                            <td>Membership Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageMembers;