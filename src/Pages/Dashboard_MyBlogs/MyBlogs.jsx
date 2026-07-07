import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import DashboardLoading from '../../Shared/DashboardLoading';

const statusStyles = {
    pending: 'bg-amber-100 text-amber-900',
    approved: 'bg-emerald-100 text-emerald-900',
    declined: 'bg-rose-100 text-rose-900'
};

const MyBlogs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingBlog, setEditingBlog] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', category: '', excerpt: '', content: '' });

    const { data: blogs = [], isLoading, refetch } = useQuery({
        queryKey: ['dashboard-my-blogs', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const response = await axiosSecure.get('/blogs/me', { withCredentials: true });
            return response?.data;
        },
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false
    });

    const summary = useMemo(() => {
        return blogs.reduce((accumulator, blog) => {
            accumulator.total += 1;
            accumulator[blog?.status || 'pending'] = (accumulator[blog?.status || 'pending'] || 0) + 1;
            return accumulator;
        }, { total: 0, pending: 0, approved: 0, declined: 0 });
    }, [blogs]);

    const openEditor = (blog) => {
        setEditingBlog(blog);
        setEditForm({
            title: blog?.title || '',
            category: blog?.category || '',
            excerpt: blog?.excerpt || '',
            content: blog?.content || ''
        });
    };

    const closeEditor = () => {
        setEditingBlog(null);
        setEditForm({ title: '', category: '', excerpt: '', content: '' });
    };

    const handleDelete = async (blog) => {
        const result = await Swal.fire({
            title: 'Delete this blog?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#dc2626'
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.delete(`/blogs/${blog?._id}`, { withCredentials: true });
            toast.success('Blog deleted successfully.');
            refetch();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to delete blog.');
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        try {
            await axiosSecure.patch(`/blogs/${editingBlog?._id}`, editForm, { withCredentials: true });
            toast.success('Blog updated and sent for review again.');
            closeEditor();
            refetch();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to update blog.');
        }
    };

    return (
        <div className='relative w-full overflow-hidden px-4 py-6'>
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(233,116,81,0.12),_transparent_36%),linear-gradient(180deg,_#fff_0%,_#fff7f4_100%)]' />
            <title>My Blogs | Dashboard - Rewaz</title>
            <div className='mx-auto max-w-6xl space-y-6'>
                <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <div>
                            <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Dashboard</p>
                            <h1 className='mt-3 text-3xl font-bold'>My blog submissions</h1>
                            <p className='mt-2 max-w-2xl text-sm text-white/75'>
                                Track the review status of every post you submit and see the exact reason when a post is declined.
                            </p>
                        </div>
                        <Link to='/blog' className='btn border-0 bg-white text-stone-900 hover:bg-stone-100'>Write a new blog</Link>
                    </div>
                </div>

                <div className='grid gap-4 md:grid-cols-4'>
                    <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                        <p className='text-sm text-stone-500'>Total</p>
                        <h2 className='mt-2 text-3xl font-bold text-stone-900'>{summary.total}</h2>
                    </div>
                    <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                        <p className='text-sm text-stone-500'>Pending</p>
                        <h2 className='mt-2 text-3xl font-bold text-amber-600'>{summary.pending}</h2>
                    </div>
                    <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                        <p className='text-sm text-stone-500'>Approved</p>
                        <h2 className='mt-2 text-3xl font-bold text-emerald-600'>{summary.approved}</h2>
                    </div>
                    <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                        <p className='text-sm text-stone-500'>Declined</p>
                        <h2 className='mt-2 text-3xl font-bold text-rose-600'>{summary.declined}</h2>
                    </div>
                </div>

                {isLoading ? (
                    <DashboardLoading title='Loading your blog submissions' subtitle='Pulling your latest drafts and review status…' lines={2} />
                ) : blogs.length > 0 ? (
                    <div className='grid gap-4'>
                        {blogs.map((blog) => {
                            const statusClass = statusStyles[blog?.status] || statusStyles.pending;
                            const editedFields = blog?.editedFields || [];
                            const isEdited = editedFields.length > 0;

                            return (
                                <article key={blog?._id} className={`rounded-3xl border p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5 ${isEdited ? 'border-amber-300 bg-amber-50/40' : 'border-stone-200 bg-white'}`}>
                                    {blog?.blogImage ? <img src={blog.blogImage} alt={blog?.title || 'Blog'} className='mb-4 h-48 w-full rounded-2xl object-cover' /> : null}
                                    <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                                        <div className='max-w-3xl'>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                <h2 className={`text-xl font-bold text-stone-900 ${editedFields.includes('title') ? 'rounded-lg bg-amber-100 px-2 py-1 ring-1 ring-amber-300' : ''}`}>{blog?.title}</h2>
                                                <span className='rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600'>{blog?.category}</span>
                                                {isEdited ? <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900'>Edited and re-submitted</span> : null}
                                            </div>
                                            <p className={`mt-3 text-sm text-stone-600 ${editedFields.includes('excerpt') ? 'rounded-lg bg-amber-100 px-2 py-1 ring-1 ring-amber-300' : ''}`}>{blog?.excerpt}</p>
                                            <p className={`mt-4 whitespace-pre-line text-sm leading-6 text-stone-700 ${editedFields.includes('content') ? 'rounded-2xl bg-amber-100/60 px-3 py-2 ring-1 ring-amber-300' : ''}`}>{blog?.content}</p>
                                            {isEdited ? (
                                                <div className='mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
                                                    <span className='font-semibold'>Updated sections:</span> {editedFields.join(', ')}. This version is waiting for admin review again.
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className='flex shrink-0 flex-col gap-3'>
                                            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass}`}>
                                                {blog?.status || 'pending'}
                                            </span>
                                            <p className='text-xs text-stone-500'>Submitted: {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'n/a'}</p>
                                            <div className='flex flex-wrap gap-2 pt-2'>
                                                <button type='button' onClick={() => openEditor(blog)} className='btn btn-sm brand-button-outline'>Edit</button>
                                                <button type='button' onClick={() => handleDelete(blog)} className='btn btn-sm btn-outline btn-error'>Delete</button>
                                            </div>
                                        </div>
                                    </div>

                                    {blog?.status === 'declined' ? (
                                        <div className='mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                                            <span className='font-semibold'>Decline reason:</span> {blog?.declineReason || 'No reason provided.'}
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}

                        {editingBlog ? (
                            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                                <div className='brand-surface w-full max-w-4xl overflow-hidden'>
                                    <div className='flex items-center justify-between border-b border-stone-200 px-6 py-4'>
                                        <div>
                                            <p className='brand-chip w-fit'>Edit blog</p>
                                            <h2 className='mt-2 text-2xl font-bold text-stone-900'>Update and resubmit for review</h2>
                                        </div>
                                        <button type='button' onClick={closeEditor} className='btn btn-sm btn-ghost'>Close</button>
                                    </div>

                                    <form onSubmit={handleEditSubmit} className='grid gap-4 px-6 py-6'>
                                        <div className='grid gap-4 md:grid-cols-2'>
                                            <label className='grid gap-2'>
                                                <span className='text-sm font-medium text-stone-700'>Title</span>
                                                <input value={editForm.title} onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))} className='input input-bordered soft-input w-full' />
                                            </label>
                                            <label className='grid gap-2'>
                                                <span className='text-sm font-medium text-stone-700'>Category</span>
                                                <input value={editForm.category} onChange={(event) => setEditForm((current) => ({ ...current, category: event.target.value }))} className='input input-bordered soft-input w-full' />
                                            </label>
                                        </div>

                                        <label className='grid gap-2'>
                                            <span className='text-sm font-medium text-stone-700'>Excerpt</span>
                                            <textarea value={editForm.excerpt} onChange={(event) => setEditForm((current) => ({ ...current, excerpt: event.target.value }))} className='textarea textarea-bordered soft-textarea min-h-28 w-full' />
                                        </label>

                                        <label className='grid gap-2'>
                                            <span className='text-sm font-medium text-stone-700'>Content</span>
                                            <textarea value={editForm.content} onChange={(event) => setEditForm((current) => ({ ...current, content: event.target.value }))} className='textarea textarea-bordered soft-textarea min-h-72 w-full' />
                                        </label>

                                        <div className='flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 pt-4'>
                                            <button type='button' onClick={closeEditor} className='btn btn-outline'>Cancel</button>
                                            <button type='submit' className='btn brand-button'>Save and resubmit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className='rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <h2 className='text-2xl font-bold text-stone-900'>No blogs yet</h2>
                        <p className='mt-3 text-stone-500'>Write your first blog to start the review process.</p>
                        <Link to='/blog' className='btn mt-6 border-0 bg-[#E97451] text-white hover:bg-[#d8653f]'>Write Blog</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBlogs;