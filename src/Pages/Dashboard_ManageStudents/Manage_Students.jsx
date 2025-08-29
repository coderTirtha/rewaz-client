import React, { useState } from 'react';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { IoIosSearch } from 'react-icons/io';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const Manage_Students = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Highlight matched text
    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text || '';
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return (text || '').toString().replace(regex, '<span class="bg-yellow-200 font-semibold">$1</span>');
    };

    const { data: students = [], isLoading, isError } = useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const response = await axiosSecure.get('/students', { withCredentials: true });
            return response?.data;
        }
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            setFilteredStudents([]);
            setIsSearched(false);
            setCurrentPage(1);
            return;
        }
        const lowerSearch = search.toLowerCase();
        const result = students.filter(student =>
            student?.formNumber?.toString().toLowerCase().includes(lowerSearch) ||
            student?.studentNameEnglish?.toLowerCase().includes(lowerSearch) ||
            student?.studentNameBangla?.toLowerCase().includes(lowerSearch) ||
            student?.mobileNo?.toLowerCase().includes(lowerSearch)
        );
        setFilteredStudents(result);
        setIsSearched(true);
        setCurrentPage(1);
    };

    // Final data to display
    let displayedStudents = isSearched ? filteredStudents : students;

    const totalPages = Math.ceil(displayedStudents.length / itemsPerPage);
    const paginatedStudents = displayedStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    if (isLoading) return <p className="text-center my-10">Loading students...</p>;
    if (isError) return <p className="text-center text-red-500 my-10">Failed to load students.</p>;

    return (
        <div className='w-full px-4'>
            <div className='my-8 w-full'>
                <h1 className='text-4xl font-bold text-center'>All Students</h1>

                {/* Search + Controls */}
                <form onSubmit={handleSearchSubmit} className='my-4 flex justify-between items-center gap-2 w-full'>
                    <div className="flex justify-center items-center gap-2 w-full">
                        <label className="input max-w-xs input-sm">
                            <span className="label"><IoIosSearch /></span>
                            <input
                                type="text"
                                placeholder="Search by Form No, Name or Mobile"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                        <button type="submit" className="btn btn-outline btn-sm">Search</button>
                    </div>
                </form>

                <div className='my-4 flex justify-between items-center'>
                    <h1><span className='font-bold'>Total Students: </span> {students?.length || 0}</h1>
                    <div className='flex items-center gap-2'>
                        <div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="select select-bordered select-sm max-w-xs"
                                >
                                    <option value={3}>3 per page</option>
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                </select>
                            </div>
                        </div>
                        <Link to="/dashboard/add-student">
                            <button className='btn btn-outline btn-xs'><FiPlus /> Add Student</button>
                        </Link>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr className="text-sm uppercase">
                                <th>Sl. No.</th>
                                <th>Photo</th>
                                <th>Form No</th>
                                <th>Name (English)</th>
                                <th>Name (Bangla)</th>
                                <th>Mobile</th>
                                <th>Father</th>
                                <th>Mother</th>
                                <th>Current Institution</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedStudents.length > 0 ? (
                                paginatedStudents.map((student, index) => (
                                    <tr key={student?._id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>
                                            <div className="avatar">
                                                <div className="w-10 rounded">
                                                    <img src={student?.photo} alt="Student" />
                                                </div>
                                            </div>
                                        </td>
                                        <td dangerouslySetInnerHTML={{ __html: highlightText(student?.formNumber, search) }} />
                                        <td dangerouslySetInnerHTML={{ __html: highlightText(student?.studentNameEnglish, search) }} />
                                        <td dangerouslySetInnerHTML={{ __html: highlightText(student?.studentNameBangla, search) }} className='font-bangla' />
                                        <td dangerouslySetInnerHTML={{ __html: highlightText(student?.mobileNo, search) }} />
                                        <td>{student?.fatherName}</td>
                                        <td>{student?.motherName}</td>
                                        <td>{student?.currentInstitution}</td>
                                        <td className='flex justify-center items-center gap-2'>
                                            <Link to={`/dashboard/student-details/${student?._id}`}>
                                                <button className='btn btn-outline btn-xs'><FiEdit /> Details</button>
                                            </Link>
                                            <button className='btn btn-outline btn-error btn-xs'><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-6 text-gray-500">No matching students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid gap-4">
                    {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student) => (
                            <div key={student?._id} className="p-4 rounded-xl bg-[#e0e5ec] shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="avatar">
                                        <div className="w-14 rounded">
                                            <img src={student?.photo} alt="Student" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold"
                                            dangerouslySetInnerHTML={{ __html: highlightText(student?.studentNameEnglish, search) }}
                                        />
                                        <p className="text-sm"
                                            dangerouslySetInnerHTML={{ __html: highlightText(student?.studentNameBangla, search) }}
                                        />
                                        <p className="text-sm text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: highlightText(student?.mobileNo, search) }}
                                        />
                                        <p className="text-sm"><strong>Form:</strong> {student?.formNumber}</p>
                                        <p className="text-sm"><strong>Father:</strong> {student?.fatherName}</p>
                                        <p className="text-sm"><strong>Mother:</strong> {student?.motherName}</p>
                                        <p className="text-sm"><strong>Institution:</strong> {student?.currentInstitution}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No matching students found.</p>
                    )}
                </div>

                {/* Pagination */}
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
        </div>
    );
};

export default Manage_Students;