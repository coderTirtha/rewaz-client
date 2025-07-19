import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdContentCopy, MdOutlineDeleteOutline } from 'react-icons/md';
import { IoPersonAddOutline, IoPersonRemoveOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { GrCaretNext, GrCaretPrevious } from 'react-icons/gr';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await axiosSecure.get('/users', { withCredentials: true });
            return result?.data;
        }
    });

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const usersPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search term changes
    }, [searchTerm]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
    };

    const handleIdCopy = (idx) => {
        const userID = document.getElementById(`userID${idx}`).innerText;
        navigator.clipboard.writeText(userID)
            .then(() => {
                toast.success("User ID copied to the clipboard!", { autoClose: 1000 });
            });
    };

    // Filtered users based on search term
    const filteredUsers = users?.filter(user =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRole = (role, email) => {
        const updatedRole = {
            role: role
        }
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continue"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/${email}`, updatedRole, { withCredentials: true })
                    .then(res => {
                        if (res?.data?.modifiedCount) {
                            refetch()
                            Swal.fire({
                                title: "Done!",
                                text: `${email} is now an ${role}`,
                                icon: "success"
                            });
                        }
                    })
                    .catch(error => {
                        toast.error(error.message);
                    })
            }
        });
    }

    return (
        <div className='w-full'>
            <div className='my-6 text-center'>
                <h2 className='text-4xl font-bold mb-4'>All Users</h2>
                <form onSubmit={handleSearchSubmit} className='flex justify-center gap-2'>
                    <label className="input input-sm max-w-sm">
                        <span className="label"><FaSearch /></span>
                        <input
                            type='text'
                            placeholder='Search by name, email or role...'
                            className=''
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </label>
                    <button type='submit' className='btn btn-sm'>Search</button>
                </form>
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
                        {paginatedUsers?.map((user, index) => (
                            <tr key={user?._id} className='text-xs'>
                                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>{user?.phone}</td>
                                <td className='flex justify-between items-center gap-x-3'>
                                    <span id={`userID${index}`}>{user?.userId}</span>
                                    <button onClick={() => handleIdCopy(index)} className='btn btn-outline btn-xs'>
                                        <MdContentCopy />
                                    </button>
                                </td>
                                <td>{user?.address}</td>
                                <td className={`uppercase ${user?.role === 'admin' ? 'text-green-600' : ''}`}>
                                    {user?.role}
                                </td>
                                <td className='flex gap-2'>
                                    {
                                        user?.role === "admin"
                                            ? <button onClick={() => handleRole("user", user?.email)} className='btn btn-outline btn-xs btn-error'>
                                                <IoPersonRemoveOutline /> Remove Admin
                                            </button>
                                            : <button onClick={() => handleRole("admin", user?.email)} className='btn btn-outline btn-xs btn-success'>
                                                <IoPersonAddOutline /> Make Admin
                                            </button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Buttons */}
                <div className="flex justify-center my-6 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn btn-sm btn-outline"
                        disabled={currentPage === 1}
                    >
                        <GrCaretPrevious /> Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`btn btn-sm ${currentPage === i + 1 ? 'bg-[#E97451] text-white' : 'btn-outline'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn btn-sm btn-outline"
                        disabled={currentPage === totalPages}
                    >
                        <GrCaretNext /> Next
                    </button>
                </div>

            </div>

            {/* Mobile Card View */}
            <div className='block md:hidden space-y-4'>
                {paginatedUsers?.map((user, index) => (
                    <div key={user._id} className='rounded-xl p-4 shadow-xl mx-2'>
                        <p><span className='font-semibold'>Sl. No:</span> {(currentPage - 1) * usersPerPage + index + 1}</p>
                        <p><span className='font-semibold'>Name:</span> {user?.name}</p>
                        <p><span className='font-semibold'>Email:</span> {user?.email}</p>
                        <p><span className='font-semibold'>Phone:</span> {user?.phone}</p>
                        <p><span className='font-semibold'>User ID:</span> <span id={`userID${index}`}>{user?.userId}</span> <button onClick={() => handleIdCopy(index)} className='btn btn-outline btn-xs'><MdContentCopy /></button></p>
                        <p><span className='font-semibold'>Address:</span> {user?.address}</p>
                        <p>
                            <span className='font-semibold'>Role:</span>{' '}
                            <span className={`uppercase ${user?.role === 'admin' ? 'text-green-600' : ''}`}>
                                {user?.role}
                            </span>
                        </p>
                        <div className='flex flex-col gap-2 mt-2'>
                            {
                                user?.role === "admin"
                                    ? <button onClick={() => handleRole("user", user?.email)} className='btn btn-outline btn-sm btn-error'>Remove as Admin</button>
                                    : <button onClick={() => handleRole("admin", user?.email)} className='btn btn-outline btn-sm btn-success'>Make Admin</button>
                            }
                        </div>
                    </div>
                ))}

                {/* Pagination Buttons for Mobile */}
                <div className="flex justify-center my-6 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn btn-sm btn-outline"
                        disabled={currentPage === 1}
                    >
                        <GrCaretPrevious /> Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`btn btn-sm ${currentPage === i + 1 ? 'bg-[#E97451] text-white' : 'btn-outline'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn btn-sm btn-outline"
                        disabled={currentPage === totalPages}
                    >
                        <GrCaretNext /> Next
                    </button>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default ManageUsers;
