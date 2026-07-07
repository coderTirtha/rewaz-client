import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import DashboardLoading from '../../Shared/DashboardLoading';

const statusTabs = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Declined', value: 'declined' },
    { label: 'All', value: 'all' }
];

const badgeClasses = {
    pending: 'bg-amber-100 text-amber-900',
    approved: 'bg-emerald-100 text-emerald-900',
    declined: 'bg-rose-100 text-rose-900'
};

const ManageBlogs = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('pending');

    const { data: blogs = [], isLoading, refetch } = useQuery({
        queryKey: ['manage-blogs', statusFilter],
        queryFn: async () => {
            const query = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
            const response = await axiosSecure.get(`/blogs${query}`, { withCredentials: true });
            return response?.data;
        },
        staleTime: 1000 * 15,
        refetchOnWindowFocus: false
    });

    const counts = useMemo(() => {
        return blogs.reduce((accumulator, blog) => {
            accumulator.total += 1;
            accumulator[blog?.status || 'pending'] = (accumulator[blog?.status || 'pending'] || 0) + 1;
            return accumulator;
        }, { total: 0, pending: 0, approved: 0, declined: 0 });
    }, [blogs]);

    const handleApprove = async (blog) => {
        const result = await Swal.fire({
            title: 'Approve this blog?',
            text: blog?.title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Approve'
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.patch(`/blogs/${blog?._id}/approve`, {}, { withCredentials: true });
            toast.success('Blog approved successfully.');
            refetch();
        } catch (error) {
            toast.error(error?.message || 'Failed to approve blog.');
        }
    };

    const handleDecline = async (blog) => {
        const result = await Swal.fire({
            title: 'Decline this blog',
            input: 'textarea',
            inputLabel: 'Reason for decline',
            inputPlaceholder: 'Explain what should be improved...',
            showCancelButton: true,
            confirmButtonText: 'Decline',
            confirmButtonColor: '#dc2626',
            inputValidator: (value) => {
                if (!value) return 'Please provide a reason.';
                return undefined;
            }
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.patch(
                `/blogs/${blog?._id}/decline`,
                { declineReason: result.value },
                { withCredentials: true }
            );
            toast.success('Blog declined and feedback saved.');
            refetch();
        } catch (error) {
            toast.error(error?.message || 'Failed to decline blog.');
        }
    };

    return (
        <div className='relative w-full overflow-hidden px-4 py-6'>
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(233,116,81,0.12),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#fff7f4_100%)]' />
            <title>Manage Blogs | Dashboard - Rewaz</title>
            <div className='mx-auto max-w-7xl space-y-6'>
                <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                    <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Moderation</p>
                    <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold'>Manage blog submissions</h1>
                            <p className='mt-2 max-w-2xl text-sm text-white/75'>Review author submissions, approve good posts, and leave useful decline reasons when changes are needed.</p>
                        </div>
                        <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-4'>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Total <span className='block text-2xl font-bold'>{counts.total}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Pending <span className='block text-2xl font-bold'>{counts.pending}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Approved <span className='block text-2xl font-bold'>{counts.approved}</span></div>
                            <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Declined <span className='block text-2xl font-bold'>{counts.declined}</span></div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.value}
                            type='button'
                            onClick={() => setStatusFilter(tab.value)}
                            className={`btn btn-sm ${statusFilter === tab.value ? 'bg-[#E97451] text-white border-0' : 'btn-outline'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <DashboardLoading title='Loading blog moderation queue' subtitle='Reviewing submissions and moderation status…' lines={3} />
                ) : blogs.length > 0 ? (
                    <div className='grid gap-4'>
                        {blogs.map((blog) => (
                            <article key={blog?._id} className={`rounded-3xl border p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5 ${blog?.editedFields?.length ? 'border-amber-300 bg-amber-50/40' : 'border-stone-200 bg-white'}`}>
                                {blog?.blogImage ? <img src={blog.blogImage} alt={blog?.title || 'Blog'} className='mb-4 h-48 w-full rounded-2xl object-cover' /> : null}
                                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                                    <div className='max-w-4xl'>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <h2 className={`text-xl font-bold text-stone-900 ${blog?.editedFields?.includes('title') ? 'rounded-lg bg-amber-100 px-2 py-1 ring-1 ring-amber-300' : ''}`}>{blog?.title}</h2>
                                            <span className='rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600'>{blog?.category}</span>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[blog?.status] || badgeClasses.pending}`}>
                                                {blog?.status || 'pending'}
                                            </span>
                                            {blog?.editedFields?.length ? <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900'>Edited and resubmitted</span> : null}
                                        </div>
                                        <p className={`mt-3 text-sm text-stone-600 ${blog?.editedFields?.includes('excerpt') ? 'rounded-lg bg-amber-100 px-2 py-1 ring-1 ring-amber-300' : ''}`}>{blog?.excerpt}</p>
                                        <p className={`mt-4 whitespace-pre-line text-sm leading-6 text-stone-700 ${blog?.editedFields?.includes('content') ? 'rounded-2xl bg-amber-100/60 px-3 py-2 ring-1 ring-amber-300' : ''}`}>{blog?.content}</p>
                                        {blog?.editedFields?.length ? (
                                            <div className='mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
                                                <span className='font-semibold'>Edited sections:</span> {blog?.editedFields.join(', ')}. Review the highlighted parts before approval.
                                            </div>
                                        ) : null}
                                        <div className='mt-4 flex flex-wrap gap-3 text-xs text-stone-500'>
                                            <span>By: {blog?.authorName || blog?.authorEmail}</span>
                                            <span>Submitted: {blog?.createdAt ? new Date(blog.createdAt).toLocaleString() : 'n/a'}</span>
                                            {blog?.reviewedAt ? <span>Reviewed: {new Date(blog.reviewedAt).toLocaleString()}</span> : null}
                                            {blog?.editedAt ? <span>Edited: {new Date(blog.editedAt).toLocaleString()}</span> : null}
                                        </div>
                                    </div>

                                    <div className='flex shrink-0 flex-col gap-2'>
                                        {blog?.status === 'pending' ? (
                                            <>
                                                <button type='button' onClick={() => handleApprove(blog)} className='btn btn-sm border-0 bg-emerald-600 text-white hover:bg-emerald-700'>Approve</button>
                                                <button type='button' onClick={() => handleDecline(blog)} className='btn btn-sm border-0 bg-rose-600 text-white hover:bg-rose-700'>Decline</button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>

                                {blog?.status === 'declined' ? (
                                    <div className='mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                                        <span className='font-semibold'>Reason:</span> {blog?.declineReason || 'No reason provided.'}
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className='rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        No blogs found for this filter.
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManageBlogs;