import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { IoIosSearch, IoMdInformationCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';

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

    const { data: members = [], isLoading, isError } = useQuery({
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

    return (
        <div className="px-4 w-full">
            <div className='my-6'>
                <h1 className='text-4xl font-bold text-center'>All Members</h1>
            </div>

            {/* Search, Sort, and Rows Per Page Controls */}
            <form onSubmit={handleSearchSubmit} className="flex justify-between mb-6 gap-2 flex-wrap">
                <div className='flex justify-center items-center gap-2 min-w-sm'>
                    <label className="input max-w-xs input-sm">
                        <span className="label"><IoIosSearch /></span>
                        <input
                            type="text"
                            placeholder="Search by name, email or phone"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className=""
                        />
                    </label>
                    <button type="submit" className="btn btn-outline btn-sm">Search</button>
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
            <div className="hidden md:block overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                        <tr className="text-sm uppercase">
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
                                    <tr key={member?._id}>
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
                                        <td className='uppercase text-warning'>{member?.membershipStatus}</td>
                                        <td className='flex gap-2'>
                                            <button className='btn btn-outline btn-xs btn-success'>Approve</button>
                                            <Link to={`/member/${member?._id}`}>
                                                <button className="btn btn-outline btn-xs">
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
                            <div key={member?._id} className="border p-4 rounded-lg shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="avatar">
                                        <div className="w-14 rounded">
                                            <img src={member?.photo} alt="Member" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold" dangerouslySetInnerHTML={{ __html: highlightText(member?.name, search) }}></h2>
                                        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: highlightText(member?.email, search) }}></p>
                                        <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: highlightText(member?.phone, search) }}></p>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p><strong>Occupation:</strong> {member?.occupation}</p>
                                    <p><strong>Status:</strong> <span className="uppercase text-warning">{member?.membershipStatus}</span></p>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <button className="btn btn-outline btn-xs btn-success">Approve</button>
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
    );
};

export default ManageMembers;