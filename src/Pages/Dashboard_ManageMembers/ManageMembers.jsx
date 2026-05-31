import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { IoIosSearch, IoMdInformationCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FiUsers, FiClock, FiUserCheck } from 'react-icons/fi';

const ManageMembers = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('default'); // 'default' or 'name'
    const [itemsPerPage, setItemsPerPage] = useState(5);  // Now dynamic from dropdown

    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text || '';
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return (text || '').toString().replace(regex, '<span class="bg-yellow-200 font-semibold">$1</span>');
    };

    const { data: members = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['members'],
        queryFn: async () => {
            const result = await axiosSecure.get('/members');
            return result?.data;
        }
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            setFilteredMembers([]);
            setIsSearched(false);
            setCurrentPage(1);
            return;
        }

        const lowerSearch = search.toLowerCase();
        const result = members.filter(member =>
            member?.name?.toLowerCase().includes(lowerSearch) ||
            member?.email?.toLowerCase().includes(lowerSearch) ||
            member?.phone?.toLowerCase().includes(lowerSearch)
        );
        setFilteredMembers(result);
        setIsSearched(true);
        setCurrentPage(1);
    };

    // Determine members to display
    let displayedMembers = isSearched ? filteredMembers : members;

    if (sortOption === 'name') {
        displayedMembers = [...displayedMembers].sort((a, b) => {
            const nameA = a?.name?.toLowerCase() || '';
            const nameB = b?.name?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });
    }

    const totalPages = Math.ceil(displayedMembers.length / itemsPerPage);
    const paginatedMembers = displayedMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    if (isLoading) return <p className="text-center my-10">Loading members...</p>;
    if (isError) return <p className="text-center text-red-500 my-10">Failed to load members.</p>;

    const handleApproval = (email) => {
        const approvedMember = {
            membershipStatus: "approved"
        }
        axiosSecure.patch(`/members/${email}`, approvedMember, { withCredentials: true })
        .then(res => {
            console.log(res?.data);
            if(res?.data?.modifiedCount) {
                toast.success(`${email} has been approved as a member!`);
                refetch();
            }
        })
        .catch(error => {
            toast.error(error.message);
        })
    }

    const summary = {
        total: members?.length || 0,
        pending: members?.filter((member) => member?.membershipStatus === 'pending')?.length || 0,
        approved: members?.filter((member) => member?.membershipStatus === 'approved')?.length || 0,
    };

    return (
        <div className="relative w-full overflow-hidden px-4 py-6">
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(233,116,81,0.12),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#fff7f4_100%)]' />
            <title>Manage Members | Dashboard - Rewaz</title>
            <div className='mx-auto max-w-7xl space-y-6'>
                <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                    <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Administration</p>
                    <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold'>Manage members</h1>
                            <p className='mt-2 max-w-2xl text-sm text-white/75'>Review membership requests, approve entries, and keep the member directory tidy and easy to browse.</p>
                        </div>
                        <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-3'>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Total <span className='block text-2xl font-bold'>{summary.total}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Pending <span className='block text-2xl font-bold'>{summary.pending}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Approved <span className='block text-2xl font-bold'>{summary.approved}</span></div>
                        </div>
                    </div>
                </div>

                {/* Search, Sort, and Rows Per Page Controls */}
                <form onSubmit={handleSearchSubmit} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className='flex w-full items-center gap-2 lg:max-w-xl'>
                        <label className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 shadow-sm">
                            <IoIosSearch className='text-stone-400' />
                            <input
                                type="text"
                                placeholder="Search by name, email or phone"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none"
                            />
                        </label>
                        <button type="submit" className="btn brand-button">Search</button>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="select select-bordered select-sm max-w-xs"
                            aria-label="Sort members"
                        >
                            <option value="default">Default</option>
                            <option value="name">Sort by Name</option>
                        </select>

                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="select select-bordered select-sm max-w-xs"
                            aria-label="Rows per page"
                        >
                            <option value={3}>3 per page</option>
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                        </select>
                    </div>
                </form>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full rounded-3xl border border-stone-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-stone-50 text-sm uppercase text-stone-500">
                            <th>Sl. No.</th>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Occupation</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paginatedMembers.length > 0 ? (
                                paginatedMembers.map((member, index) => (
                                    <tr key={member?._id} className='transition hover:bg-stone-50/80'>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>
                                            <div className="avatar">
                                                <div className="w-10 rounded">
                                                    <img src={member?.photo} alt="Member" />
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            dangerouslySetInnerHTML={{ __html: highlightText(member?.name, search) }}
                                        />
                                        <td
                                            dangerouslySetInnerHTML={{ __html: highlightText(member?.email, search) }}
                                        />
                                        <td
                                            dangerouslySetInnerHTML={{ __html: highlightText(member?.phone, search) }}
                                        />
                                        <td className='font-bangla'>{member?.occupation}</td>
                                        <td className={`uppercase font-semibold ${member?.membershipStatus === "pending" ? 'text-amber-600' : 'text-emerald-600'}`}>{member?.membershipStatus}</td>
                                        <td className='flex flex-col gap-2'>
                                            {
                                                member?.membershipStatus === "pending" ? <button onClick={() => handleApproval(member?.email)} className='btn btn-outline btn-xs btn-success'>Approve</button> : ''
                                            }
                                            <Link to={`/member/${member?._id}`}>
                                                <button className="btn btn-outline btn-xs w-full">
                                                    <IoMdInformationCircleOutline /> Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-6 text-gray-500">No matching members found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid gap-4">
                {
                    paginatedMembers.length > 0 ? (
                        paginatedMembers.map((member) => (
                            <div
                                key={member?._id}
                                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="avatar">
                                        <div className="w-14 rounded">
                                            <img src={member?.photo} alt="Member" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2
                                            className="font-semibold"
                                            dangerouslySetInnerHTML={{ __html: highlightText(member?.name, search) }}
                                        />
                                        <p
                                            className="text-sm text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: highlightText(member?.email, search) }}
                                        />
                                        <p
                                            className="text-sm text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: highlightText(member?.phone, search) }}
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 text-sm">
                                    <p><strong>Occupation:</strong> <span className='font-bangla'>{member?.occupation}</span></p>
                                    <p><strong>Status:</strong> <span className={`uppercase font-semibold ${member?.membershipStatus === "pending" ? "text-amber-600" : "text-emerald-600"}`}>{member?.membershipStatus}</span></p>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    {
                                        member?.membershipStatus === "pending" ? <button onClick={() => handleApproval(member?.email)} className='btn btn-outline btn-xs btn-success'>Approve</button> : ''
                                    }
                                    <Link to={`/member/${member?._id}`}>
                                        <button className="btn btn-outline btn-xs">
                                            <IoMdInformationCircleOutline /> Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No matching members found.</p>
                    )
                }
            </div>


            {/* Always-visible Pagination */}
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
                <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {[...Array(totalPages).keys()].map(i => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'bg-[#E97451] text-white' : 'btn-outline'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="btn btn-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            </div>

            <ToastContainer />
        </div>
    );
};

export default ManageMembers;