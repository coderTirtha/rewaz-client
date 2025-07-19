import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdContentCopy, MdOutlineDeleteOutline } from 'react-icons/md';
import { IoPersonAddOutline, IoPersonRemoveOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await axiosSecure.get('/users', { withCredentials: true });
            return result?.data;
        }
    });
    const handleIdCopy = (idx) => {
        const userID = document.getElementById(`userID${idx}`).innerText;
        navigator.clipboard.writeText(userID)
            .then(() => {
                toast.success("User ID copied to the clipboard!", {
                    autoClose: 1500
                });
            })
    }
    return (
        <div className='w-full'>
            <div className='my-6'>
                <h2 className='text-4xl text-center font-bold'>All Users</h2>
            </div>

            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto mx-4'>
                <table className='table w-full'>
                    <thead>
                        <tr>
                            <th>Sl. No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>User ID</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, index) => (
                            <tr key={user?._id} className='text-xs'>
                                <td>{index + 1}</td>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>{user?.phone}</td>
                                <td className='flex justify-between items-center gap-x-3'><span id={`userID${index}`}>{user?.userId}</span> <button onClick={() => handleIdCopy(index)} className='btn btn-outline btn-xs'><MdContentCopy /></button></td>
                                <td>{user?.address}</td>
                                <td className={`uppercase ${user?.role === 'admin' ? 'text-green-600' : ''}`}>
                                    {user?.role}
                                </td>
                                <td className='flex gap-2'>
                                    {
                                        user?.role == "admin" ? <button className='btn btn-outline btn-xs btn-error'><IoPersonRemoveOutline /> Remove Admin</button> : <button className='btn btn-outline btn-xs btn-success'><IoPersonAddOutline /> Make Admin</button>
                                    }
                                    <button className='btn btn-outline btn-xs'>
                                        <MdOutlineDeleteOutline />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className='block md:hidden space-y-4'>
                {users?.map((user, index) => (
                    <div key={user._id} className='rounded-xl p-4 shadow-xl mx-2'>
                        <p><span className='font-semibold'>Sl. No:</span> {index + 1}</p>
                        <p><span className='font-semibold'>Name:</span> {user?.name}</p>
                        <p><span className='font-semibold'>Email:</span> {user?.email}</p>
                        <p><span className='font-semibold'>Phone:</span> {user?.phone}</p>
                        <p><span className='font-semibold'>User ID:</span> <span>{user?.userId}</span> <button onClick={() => handleIdCopy(index)} className='btn btn-outline btn-xs'><MdContentCopy /></button></p>
                        <p><span className='font-semibold'>Address:</span> {user?.address}</p>
                        <p>
                            <span className='font-semibold'>Role:</span>{' '}
                            <span className={`uppercase ${user?.role === 'admin' ? 'text-green-600' : ''}`}>
                                {user?.role}
                            </span>
                        </p>
                        <div className='flex flex-col gap-2 mt-2'>
                            {
                                user?.role == "admin" ? <button className='btn btn-outline btn-sm btn-error'><IoPersonRemoveOutline /> Remove Admin</button> : <button className='btn btn-outline btn-sm btn-success'><IoPersonAddOutline /> Make Admin</button>
                            }
                            <button className='btn btn-outline btn-sm'>
                                <MdOutlineDeleteOutline />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManageUsers;
