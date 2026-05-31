import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const statusMeta = {
    pending: { label: 'Pending review', className: 'bg-amber-100 text-amber-900' },
    approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-900' },
    declined: { label: 'Declined', className: 'bg-rose-100 text-rose-900' }
};

const Blog = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

    const { data: myBlogs = [], refetch, isLoading } = useQuery({
        queryKey: ['my-blogs', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const response = await axiosSecure.get('/blogs/me', { withCredentials: true });
            return response?.data;
        },
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                title: data?.title,
                category: data?.category,
                excerpt: data?.excerpt,
                content: data?.content,
                authorId: user?.uid,
                authorName: user?.displayName || user?.email,
                authorPhoto: user?.photoURL || ''
            };

            const response = await axiosSecure.post('/blogs', payload, { withCredentials: true });

            if (response?.data?.insertedId) {
                toast.success('Blog submitted. It is now waiting for admin approval.');
                reset();
                refetch();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to submit blog.');
        }
    };

    return (
        <div className='page-surface relative overflow-hidden px-4 pb-10 pt-28 md:pt-32'>
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(233,116,81,0.14),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(28,28,28,0.06),_transparent_32%),linear-gradient(180deg,_#fff_0%,_#fff8f5_100%)]' />
            <title>Write Blog | Rewaz</title>
            <div className='mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]'>
                <section className='brand-surface overflow-hidden'>
                    <div className='brand-banner border-b border-stone-200 px-6 py-8 text-white sm:px-8'>
                        <p className='brand-chip w-fit border-white/15 bg-white/10 text-white'>Community Journal</p>
                        <h1 className='mt-3 text-3xl font-bold sm:text-5xl'>Write a blog for the Rewaz community</h1>
                        <p className='mt-4 max-w-2xl text-sm text-white/75 sm:text-base'>
                            Share updates, stories, teaching notes, and reflections. Every submission goes to admin review before it becomes visible publicly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-5 px-6 py-6 sm:px-8'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <label className='grid gap-2'>
                                <span className='text-sm font-medium text-stone-700'>Title</span>
                                <input {...register('title', { required: true })} type='text' className='input input-bordered soft-input w-full text-stone-900' placeholder='Blog title' required />
                            </label>
                            <label className='grid gap-2'>
                                <span className='text-sm font-medium text-stone-700'>Category</span>
                                <input {...register('category', { required: true })} type='text' className='input input-bordered soft-input w-full text-stone-900' placeholder='Teaching, Event, Announcement...' required />
                            </label>
                        </div>

                        <label className='grid gap-2'>
                            <span className='text-sm font-medium text-stone-700'>Short excerpt</span>
                            <textarea {...register('excerpt', { required: true })} className='textarea textarea-bordered soft-textarea min-h-28 w-full text-stone-900' placeholder='A short summary that helps the reviewer understand the post...' required />
                        </label>

                        <label className='grid gap-2'>
                            <span className='text-sm font-medium text-stone-700'>Blog content</span>
                            <textarea {...register('content', { required: true })} className='textarea textarea-bordered soft-textarea min-h-72 w-full text-stone-900' placeholder='Write the full blog post here...' required />
                        </label>

                        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4'>
                            <p className='text-sm text-stone-500'>Posts are reviewed by admins before they appear on the public site.</p>
                            <button type='submit' className='btn brand-button' disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </div>
                    </form>
                </section>

                <aside className='space-y-6 lg:sticky lg:top-6 lg:self-start'>
                    <div className='brand-surface p-6'>
                        <p className='brand-chip w-fit'>Approval Flow</p>
                        <h2 className='mt-3 text-2xl font-bold text-stone-900'>What happens next</h2>
                        <div className='mt-5 space-y-4 text-sm text-stone-600'>
                            <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-sm'>
                                <p className='font-semibold text-stone-900'>1. Submit</p>
                                <p>Your blog is saved with a pending status immediately after submission.</p>
                            </div>
                            <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-sm'>
                                <p className='font-semibold text-stone-900'>2. Review</p>
                                <p>Admins inspect the content from the manage blogs dashboard.</p>
                            </div>
                            <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-sm'>
                                <p className='font-semibold text-stone-900'>3. Publish or decline</p>
                                <p>If declined, the reason is shown in your dashboard so you can revise it.</p>
                            </div>
                        </div>
                    </div>

                    <div className='brand-surface p-6'>
                        <div className='flex items-center justify-between gap-3'>
                            <div>
                                <p className='brand-chip w-fit'>My submissions</p>
                                <h2 className='mt-3 text-2xl font-bold text-stone-900'>Recent blogs</h2>
                            </div>
                            <Link to='/dashboard/my-blogs' className='btn btn-sm brand-button-outline'>View all</Link>
                        </div>

                        <div className='mt-5 space-y-4'>
                            {isLoading ? (
                                <p className='text-sm text-stone-500'>Loading your submissions...</p>
                            ) : myBlogs.length > 0 ? (
                                myBlogs.slice(0, 3).map((blog) => {
                                    const meta = statusMeta[blog?.status] || statusMeta.pending;

                                    return (
                                        <article key={blog?._id} className='rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-4 shadow-sm transition-transform hover:-translate-y-0.5'>
                                            <div className='flex items-start justify-between gap-3'>
                                                <div className='min-w-0'>
                                                    <h3 className='font-semibold text-stone-900'>{blog?.title}</h3>
                                                    <p className='truncate text-sm text-stone-500'>{blog?.category}</p>
                                                </div>
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}>
                                                    {meta.label}
                                                </span>
                                            </div>
                                            <p className='mt-3 text-sm text-stone-600 line-clamp-3'>{blog?.excerpt}</p>
                                            {blog?.status === 'declined' && blog?.declineReason ? (
                                                <p className='mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700'>
                                                    Reason: {blog?.declineReason}
                                                </p>
                                            ) : null}
                                        </article>
                                    );
                                })
                            ) : (
                                <div className='rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500'>
                                    You have not submitted any blogs yet.
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Blog;