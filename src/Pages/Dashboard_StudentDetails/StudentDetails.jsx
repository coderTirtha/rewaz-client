import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { MdOutlineFileDownload, MdOutlinePhoneEnabled, MdOutlineDateRange } from 'react-icons/md';

const StudentDetails = () => {
    const { studentId } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: student } = useQuery({
        queryKey: ['student', studentId],
        queryFn: async () => {
            const response = await axiosSecure.get(`/students/${studentId}`, { withCredentials: true });
            return response?.data;
        },
        enabled: !!studentId
    });

    const handleDownloadIDCard = async () => {
        try {
            const res = await axiosSecure.get(`/students/${studentId}/id-card`, {
                withCredentials: true,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${studentId}-idcard.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    }

    const createdAt = student?.createdAt ? new Date(student.createdAt).toLocaleString() : 'N/A';
    const dob = student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A';

    return (
        <div className='page-surface my-12 px-4'>
            <title>Student Details | Rewaz</title>

            <div className='mx-auto max-w-6xl'>
                <div className='rounded-3xl overflow-hidden shadow-lg'>
                    <div className='bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white'>
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-4'>
                                <div className='avatar'>
                                    <div className='w-28 h-28 rounded-full ring-4 ring-white overflow-hidden'>
                                        <img src={student?.photo} alt={student?.studentNameEnglish || 'Student'} className='object-cover w-full h-full' />
                                    </div>
                                </div>
                                <div>
                                    <h1 className='text-2xl font-bold'>{student?.studentNameEnglish}</h1>
                                    <div className='text-sm text-white/90 font-bangla'>{student?.studentNameBangla}</div>
                                    <div className='mt-2 flex items-center gap-2'>
                                        <span className='badge bg-white/10 border-white/20 text-white'>{student?.formNumber}</span>
                                        <span className='badge bg-white/10 border-white/20 text-white'>{student?.studentId}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='text-right'>
                                <button onClick={handleDownloadIDCard} className='btn btn-sm border-white text-white bg-transparent hover:bg-white/10'><MdOutlineFileDownload className='mr-2' />Download ID</button>
                                <div className='mt-2 text-xs text-white/80'><MdOutlineDateRange className='inline-block mr-1' />{createdAt}</div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-6'>
                        <div className='grid gap-6 md:grid-cols-3'>
                            <div className='space-y-4'>
                                <div className='rounded-2xl border border-stone-100 p-4'>
                                    <h4 className='text-sm text-stone-500'>Contact</h4>
                                    <div className='mt-2 font-semibold text-stone-900 flex items-center gap-2'><MdOutlinePhoneEnabled />{student?.mobileNo || 'N/A'}</div>
                                </div>

                                <div className='rounded-2xl border border-stone-100 p-4'>
                                    <h4 className='text-sm text-stone-500'>Present Address</h4>
                                    <div className='mt-2 text-stone-700'>{student?.presentAddress || 'N/A'}</div>
                                </div>
                            </div>

                            <div className='md:col-span-2'>
                                <div className='rounded-2xl border border-stone-100 p-4'>
                                    <h4 className='text-sm text-stone-500 mb-3'>Personal & Academic Details</h4>
                                    <div className='grid gap-3 md:grid-cols-2'>
                                        <div>
                                            <p className='text-xs text-stone-500'>Father's name</p>
                                            <p className='font-semibold text-stone-900'>{student?.fatherName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-stone-500'>Mother's name</p>
                                            <p className='font-semibold text-stone-900'>{student?.motherName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-stone-500'>Date of birth</p>
                                            <p className='font-semibold text-stone-900'>{dob}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-stone-500'>Qualification</p>
                                            <p className='font-semibold text-stone-900'>{student?.educationalQualification || 'N/A'}</p>
                                        </div>
                                        <div className='md:col-span-2'>
                                            <p className='text-xs text-stone-500'>Permanent address</p>
                                            <p className='font-semibold text-stone-900'>{student?.permanentAddress?.village || ''}{student?.permanentAddress ? `, ${student.permanentAddress.postOffice || ''}, ${student.permanentAddress.thana || ''}, ${student.permanentAddress.district || ''}` : ''}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-stone-500'>Current institution</p>
                                            <p className='font-semibold text-stone-900'>{student?.currentInstitution || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDetails;