import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaUsers } from 'react-icons/fa';
import useAdmin from '../../hooks/useAdmin';
import { toast, ToastContainer } from 'react-toastify';
import memberPhoto from '/images/member.png';
import usersPhoto from '/images/users.png';

const Overview = () => {
    const axiosSecure = useAxiosSecure();
    const { isAdmin, isAdminLoading } = useAdmin();
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    useEffect(() => {
        if (!isAdmin) return;
        axiosSecure.get('/total-users', { withCredentials: true })
            .then(response => {
                setUsers(response?.data?.totalUsers);
            })
            .catch(error => {
                toast.error(error?.message);
            });
        axiosSecure.get('/total-members', { withCredentials: true })
            .then(response => {
                setMembers(response?.data?.totalMembers);
            })
            .catch(error => {
                toast.error(error?.message);
            });
    }, [isAdmin]);
    return (
        <>
            {
                isAdmin && !isAdminLoading ? <div className='w-full px-4'>
                    <title>Overview | Dashboard - Rewaz</title>
                    <div className='mx-10 max-w-4xl my-12 lg:mx-auto'>
                        <h2 className='text-2xl font-bold'>Overview</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 w-full my-6'>
                            <div className='rounded-lg border-2 border-gray-200 p-6 flex justify-center items-center'>
                                <div className='w-full'>
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            <h1 className='text-5xl font-bold text-[#E97451]'>{users}</h1>
                                            <h5 className='font-semibold'>Total Users</h5>
                                        </div>
                                        <img src={usersPhoto} alt="" className='max-w-[100px]' />
                                    </div>
                                </div>
                            </div>
                            <div className='rounded-lg border-2 border-gray-200 p-6 flex justify-center items-center'>
                                <div className='w-full'>
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            <h1 className='text-5xl font-bold text-[#E97451]'>{members}</h1>
                                            <h5 className='font-semibold'>Total Members</h5>
                                        </div>
                                        <img src={memberPhoto} alt="" className='max-w-[100px]' />
                                    </div>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div> : <>
                    <div className='min-h-screen flex justify-center items-center'>
                        <p>Loading...</p>
                    </div>
                </>
            }
            <ToastContainer />
        </>
    );
};

export default Overview;