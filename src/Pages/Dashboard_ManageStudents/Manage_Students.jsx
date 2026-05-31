import React, { useState } from 'react';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { IoIosSearch, IoMdInformationCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { FiUsers, FiUserCheck, FiSearch } from 'react-icons/fi';

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

    const { data: students = [], isLoading, isError, refetch } = useQuery({
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
            student?.studentId?.toLowerCase().includes(lowerSearch)
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

    const handleStudentDeletion = async(studentID) => {
        Swal.fire({
            title: 'Are you sure you want to delete this student?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continue"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/students/${studentID}`, { withCredentials: true });
                    Swal.fire('Deleted!', 'The student has been deleted.', 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to delete the student.', 'error');
                }
            }
        });
    }

    const summary = {
        total: students?.length || 0,
        recent: students?.filter((student) => {
            const createdAt = student?.createdAt ? new Date(student.createdAt).getTime() : 0;
            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            return createdAt >= weekAgo;
        })?.length || 0,
    };

    return (
        <div className='relative w-full overflow-hidden px-4 py-6'>
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(233,116,81,0.12),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#fff7f4_100%)]' />
            <div className='mx-auto max-w-7xl space-y-6'>
                <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                    <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Administration</p>
                    <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold'>Manage students</h1>
                            <p className='mt-2 max-w-2xl text-sm text-white/75'>Browse enrolled students, search quickly by form or student ID, and open their details or remove records when needed.</p>
                        </div>
                        <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-2'>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Total <span className='block text-2xl font-bold'>{summary.total}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>This week <span className='block text-2xl font-bold'>{summary.recent}</span></div>
                        </div>
                    </div>
                </div>

                {/* Search + Controls */}
                <form onSubmit={handleSearchSubmit} className='rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div className="flex w-full items-center gap-2 lg:max-w-2xl">
                        <label className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 shadow-sm">
                            <IoIosSearch className='text-stone-400' />
                            <input
                                type="text"
                                placeholder="Search by Form No, Name or Student ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full bg-transparent outline-none'
                            />
                        </label>
                        <button type="submit" className="btn brand-button">Search</button>
                    </div>

                    <div className='flex items-center gap-2'>
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
                        <Link to="/dashboard/add-student">
                            <button className='btn brand-button-outline btn-xs md:btn-sm'><FiPlus /> Add Student</button>
                        </Link>
                    </div>
                </form>

                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <p className='text-sm text-stone-500'>Total Students</p>
                        <h2 className='mt-2 text-3xl font-bold text-stone-900'>{summary.total}</h2>
                    </div>
                    <div className='rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <p className='text-sm text-stone-500'>Added in last 7 days</p>
                        <h2 className='mt-2 text-3xl font-bold text-stone-900'>{summary.recent}</h2>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto w-full rounded-3xl border border-stone-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-stone-50 text-sm uppercase text-stone-500">
                                <th>Sl. No.</th>
                                <th>Photo</th>
                                <th>Form No</th>
                                <th>Name (English)</th>
                                <th>Name (Bangla)</th>
                                <th>Mobile</th>
                                <th>Father</th>
                                <th>Mother</th>
                                <th>Student ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedStudents.length > 0 ? (
                                paginatedStudents.map((student, index) => (
                                    <tr key={student?._id} className='transition hover:bg-stone-50/80'>
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
                                        <td>{student?.mobileNo}</td>
                                        <td>{student?.fatherName}</td>
                                        <td>{student?.motherName}</td>
                                        <td dangerouslySetInnerHTML={{ __html: highlightText(student?.studentId, search) }} />
                                        <td className='flex justify-center items-center gap-2'>
                                            <Link to={`/dashboard/student-details/${student?.studentId}`}>
                                                <button className='btn btn-outline btn-xs'><IoMdInformationCircleOutline /> Details</button>
                                            </Link>
                                            <button onClick={() => handleStudentDeletion(student?.studentId)} className='btn btn-outline btn-error btn-xs'><FiTrash2 /></button>
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
                            <div key={student?._id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
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
                                        <p className="text-sm"><strong>Student ID:</strong> {student?.studentId}</p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-2 mt-4'>
                                    <Link to={`/dashboard/student-details/${student?.studentId}`} className='flex-1'>
                                        <button className='btn btn-outline btn-xs w-full'><IoMdInformationCircleOutline /> Details</button>
                                    </Link>
                                    <div className='flex-1'>
                                        <button className='btn btn-outline btn-error btn-xs w-full'><FiTrash2 /></button>
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
            <ToastContainer />
        </div>
    );
};

export default Manage_Students;