import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiSearch, FiUser } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import DashboardLoading from '../../Shared/DashboardLoading';

const BlogFeed = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [query, setQuery] = useState('');

    const { data: blogs = [], isLoading, isError } = useQuery({
        queryKey: ['blog-feed', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const response = await axiosSecure.get('/blogs/feed', { withCredentials: true });
            return response?.data || [];
        },
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false
    });

    const filteredBlogs = useMemo(() => {
        const search = query.trim().toLowerCase();

        if (!search) {
            return blogs;
        }

        return blogs.filter((blog) => {
            const title = blog?.title || '';
            const category = blog?.category || '';
            const author = blog?.authorName || '';
            const excerpt = blog?.excerpt || '';

            return [title, category, author, excerpt].some((value) => value.toLowerCase().includes(search));
        });
    }, [blogs, query]);

    const stats = useMemo(() => {
        return filteredBlogs.reduce((acc, blog) => {
            acc.total += 1;
            acc.categories.add(blog?.category || 'Uncategorized');
            acc.authors.add(blog?.authorName || 'Rewaz member');
            return acc;
        }, { total: 0, categories: new Set(), authors: new Set() });
    }, [filteredBlogs]);

    return (
        <div className='page-surface relative overflow-hidden px-4 pb-12 pt-28 md:pt-32'>
            <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(233,116,81,0.14),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(28,28,28,0.06),_transparent_32%),linear-gradient(180deg,_#fff_0%,_#fff8f5_100%)]' />
            <title>Blog Feed | Rewaz</title>

            <div className='mx-auto max-w-7xl space-y-6'>
                <section className='brand-surface overflow-hidden'>
                    <div className='brand-banner border-b border-stone-200 px-6 py-8 text-white sm:px-8'>
                        <p className='brand-chip w-fit border-white/15 bg-white/10 text-white'>Community Feed</p>
                        <h1 className='mt-3 text-3xl font-bold sm:text-5xl'>Read blogs shared by Rewaz members</h1>
                        <p className='mt-4 max-w-2xl text-sm text-white/75 sm:text-base'>
                            Explore approved stories, announcements, reflections, and class updates from registered users in one place.
                        </p>
                        <div className='mt-5 flex flex-wrap gap-3'>
                            <Link to='/blog' className='btn border-0 bg-white text-stone-900 hover:bg-stone-100'>Write your own blog</Link>
                            <Link to='/dashboard/my-blogs' className='btn border-white/15 bg-transparent text-white hover:bg-white/10'>My blogs</Link>
                        </div>
                    </div>

                    <div className='grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-3'>
                        <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                            <p className='text-sm text-stone-500'>Approved posts</p>
                            <h2 className='mt-2 text-3xl font-bold text-stone-900'>{stats.total}</h2>
                        </div>
                        <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                            <p className='text-sm text-stone-500'>Categories</p>
                            <h2 className='mt-2 text-3xl font-bold text-stone-900'>{stats.categories.size}</h2>
                        </div>
                        <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                            <p className='text-sm text-stone-500'>Authors</p>
                            <h2 className='mt-2 text-3xl font-bold text-stone-900'>{stats.authors.size}</h2>
                        </div>
                    </div>

                    <div className='border-t border-stone-200 px-6 py-5 sm:px-8'>
                        <label className='flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm'>
                            <FiSearch className='text-xl text-stone-400' />
                            <input
                                type='text'
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder='Search by title, category, author, or excerpt'
                                className='w-full bg-transparent text-stone-900 outline-none placeholder:text-stone-400'
                            />
                        </label>
                    </div>
                </section>

                {isLoading ? (
                    <DashboardLoading title='Loading blog feed' subtitle='Fetching recent stories and activity…' lines={2} />
                ) : isError ? (
                    <div className='rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        Unable to load the blog feed right now.
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className='grid gap-5 lg:grid-cols-2'>
                        {filteredBlogs.map((blog) => (
                            <article key={blog?._id} className='brand-surface overflow-hidden transition-transform hover:-translate-y-1'>
                                {blog?.blogImage ? <img src={blog.blogImage} alt={blog?.title || 'Blog'} className='h-56 w-full object-cover' /> : null}
                                <div className='brand-banner px-6 py-5 text-white'>
                                    <div className='flex flex-wrap items-center justify-between gap-3'>
                                        <span className='brand-chip border-white/15 bg-white/10 text-white'>{blog?.category || 'Uncategorized'}</span>
                                        <span className='rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85'>Approved</span>
                                    </div>
                                    <h2 className='mt-4 text-2xl font-bold'>{blog?.title}</h2>
                                    <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75'>
                                        <span className='inline-flex items-center gap-2'><FiUser /> {blog?.authorName || 'Rewaz member'}</span>
                                        <span className='inline-flex items-center gap-2'><FiCalendar /> {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'n/a'}</span>
                                    </div>
                                </div>

                                <div className='space-y-4 px-6 py-6'>
                                    <p className='text-sm leading-6 text-stone-600'>{blog?.excerpt}</p>
                                    <p className='line-clamp-5 whitespace-pre-line text-sm leading-6 text-stone-700'>{blog?.content}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className='rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <FiBookOpen className='mx-auto text-4xl text-stone-300' />
                        <h2 className='mt-4 text-2xl font-bold text-stone-900'>No matching blogs found</h2>
                        <p className='mt-2 text-stone-500'>Try another search or come back later for more posts.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogFeed;