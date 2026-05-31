import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdContentCopy, MdOutlineDeleteOutline } from 'react-icons/md';
import { IoPersonAddOutline, IoPersonRemoveOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { GrCaretNext, GrCaretPrevious } from 'react-icons/gr';
import Swal from 'sweetalert2';
import { FiUsers, FiUserCheck, FiUserX } from 'react-icons/fi';

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

    const summary = {
        total: users?.length || 0,
        admins: users?.filter((user) => user?.role === 'admin')?.length || 0,
        members: users?.filter((user) => user?.role === 'member')?.length || 0,
        guests: users?.filter((user) => !user?.role || user?.role === 'user')?.length || 0,
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
        <div className='relative w-full overflow-hidden px-4 py-6'>
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(233,116,81,0.12),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#fff7f4_100%)]' />
            <title>Manage Users | Dashboard - Rewaz</title>
            <div className='mx-auto max-w-7xl space-y-6'>
                <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                    <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Administration</p>
                    <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold'>Manage users</h1>
                            <p className='mt-2 max-w-2xl text-sm text-white/75'>Review the registered user base, promote trusted accounts, and keep the directory searchable at a glance.</p>
                        </div>
                        <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-4'>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Total <span className='block text-2xl font-bold'>{summary.total}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Admins <span className='block text-2xl font-bold'>{summary.admins}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Members <span className='block text-2xl font-bold'>{summary.members}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Users <span className='block text-2xl font-bold'>{summary.guests}</span></div>
                        </div>
                    </div>
                </div>

                <div className='rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                    <form onSubmit={handleSearchSubmit} className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                        <label className='flex w-full max-w-xl items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 shadow-sm'>
                            <FaSearch className='text-stone-400' />
                            <input
                                type='text'
                                placeholder='Search by name, email or role...'
                                className='w-full bg-transparent outline-none'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </label>
                        <button type='submit' className='btn brand-button'>Search</button>
                    </form>
                </div>

                {/* Desktop Table View */}
                <div className='hidden md:block overflow-x-auto'>
                    <table className='table w-full rounded-3xl border border-stone-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <thead>
                            <tr className='bg-stone-50 text-xs uppercase text-stone-500'>
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
                                <tr key={user?._id} className='text-xs transition hover:bg-stone-50/80'>
                                    <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                    <td className='font-semibold text-stone-900'>{user?.name}</td>
                                    <td>{user?.email}</td>
                                    <td>{user?.phone}</td>
                                    <td className='flex items-center gap-x-3'>
                                        <span id={`userID${index}`}>{user?.userId}</span>
                                        <button onClick={() => handleIdCopy(index)} className='btn btn-outline btn-xs'>
                                            <MdContentCopy />
                                        </button>
                                    </td>
                                    <td>{user?.address}</td>
                                    <td className={`uppercase font-semibold ${user?.role === 'admin' ? 'text-emerald-600' : 'text-stone-600'}`}>
                                        {user?.role}
                                    </td>
                                    <td className='flex gap-2'>
                                        {user?.role === "admin"
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
                    <div key={user._id} className='rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <p className='text-xs uppercase tracking-[0.3em] text-stone-400'>User {(currentPage - 1) * usersPerPage + index + 1}</p>
                        <h3 className='mt-2 text-lg font-bold text-stone-900'>{user?.name}</h3>
                        <p className='text-sm text-stone-500'>{user?.email}</p>
                        <div className='mt-4 grid gap-2 text-sm text-stone-700'>
                            <p><span className='font-semibold'>Phone:</span> {user?.phone}</p>
                            <p className='flex items-center gap-2'><span className='font-semibold'>User ID:</span> <span id={`userID${index}`}>{user?.userId}</span> <button onClick={() => handleIdCopy(index)} className='btn btn-outline btn-xs'><MdContentCopy /></button></p>
                            <p><span className='font-semibold'>Address:</span> {user?.address}</p>
                        </div>
                        <p>
                            <span className='font-semibold'>Role:</span>{' '}
                            <span className={`uppercase font-semibold ${user?.role === 'admin' ? 'text-emerald-600' : 'text-stone-600'}`}>
                                {user?.role}
                            </span>
                        </p>
                        <div className='flex flex-col gap-2 mt-2'>
                            {
                                user?.role === "admin"
                                    ? <button onClick={() => handleRole("user", user?.email)} className='btn btn-outline btn-sm btn-error'>Remove Admin</button>
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

            </div>

            <ToastContainer />
        </div>
    );
};

export default ManageUsers;
