import React, { useEffect, useMemo, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast, ToastContainer } from 'react-toastify';
import memberPhoto from '/images/member.png';
import usersPhoto from '/images/users.png';
import studentPhoto from '/images/student.png';
import { RiDashboard3Line } from 'react-icons/ri';
import { FiEye, FiThumbsUp, FiMessageCircle, FiClock, FiInfo } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';
import { Link } from 'react-router-dom';
import DashboardLoading from '../../Shared/DashboardLoading';

const Overview = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading: authLoading } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const [users, setUsers] = useState(null);
    const [members, setMembers] = useState(null);
    const [students, setStudents] = useState(null);
    const [rawUsers, setRawUsers] = useState(null);
    const [rawMembers, setRawMembers] = useState(null);
    const [rawStudents, setRawStudents] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [overlaps, setOverlaps] = useState({ memberUser: 0, memberStudent: 0, userStudent: 0, allThree: 0 });

    useEffect(() => {
        let active = true;

        const loadTotals = async () => {
            try {
                if (isAdmin) {
                    // Fetch full lists and deduplicate people by email/phone so totals don't double-count the same person across collections.
                    const [usersResponse, membersResponse, studentsResponse, blogsResponse] = await Promise.all([
                        axiosSecure.get('/users', { withCredentials: true }),
                        axiosSecure.get('/members', { withCredentials: true }),
                        axiosSecure.get('/students', { withCredentials: true }),
                        axiosSecure.get('/blogs?status=all', { withCredentials: true }),
                    ]);

                    if (!active) return;

                    const usersList = usersResponse?.data || [];
                    const membersList = membersResponse?.data || [];
                    const studentsList = studentsResponse?.data || [];

                    // raw totals (counts before deduplication)
                    setRawUsers(usersList.length);
                    setRawMembers(membersList.length);
                    setRawStudents(studentsList.length);

                    // Helper to normalize phone/email
                    const normalizeEmail = (e) => e ? String(e).trim().toLowerCase() : null;
                    const normalizePhone = (p) => p ? String(p).replace(/\D/g, '') : null;

                    const keyToPerson = new Map(); // maps identifier -> personId
                    const persons = new Map(); // personId -> { roles: Set }
                    let nextPersonId = 1;

                    const ensurePersonForKeys = (keys, role) => {
                        for (const k of keys) {
                            if (!k) continue;
                            const existing = keyToPerson.get(k);
                            if (existing) {
                                const p = persons.get(existing);
                                p.roles.add(role);
                                return existing;
                            }
                        }
                        // create new person
                        const pid = `p${nextPersonId++}`;
                        persons.set(pid, { roles: new Set([role]) });
                        for (const k of keys) {
                            if (!k) continue;
                            keyToPerson.set(k, pid);
                        }
                        return pid;
                    };

                    // Add users
                    usersList.forEach(u => {
                        const e = normalizeEmail(u?.email);
                        const ph = normalizePhone(u?.phone || u?.mobileNo || u?.mobile);
                        ensurePersonForKeys([e ? `email:${e}` : null, ph ? `phone:${ph}` : null], 'user');
                    });

                    // Add members
                    membersList.forEach(m => {
                        const e = normalizeEmail(m?.email);
                        const ph = normalizePhone(m?.phone || m?.mobileNo);
                        ensurePersonForKeys([e ? `email:${e}` : null, ph ? `phone:${ph}` : null], 'member');
                    });

                    // Add students (use phone if available, else studentId)
                    studentsList.forEach(s => {
                        const ph = normalizePhone(s?.mobileNo || s?.phone);
                        const sid = s?.studentId ? `studentId:${String(s.studentId)}` : null;
                        ensurePersonForKeys([ph ? `phone:${ph}` : null, sid], 'student');
                    });

                    // Compute exclusive counts by priority: member > student > user
                    let usersCount = 0, membersCount = 0, studentsCount = 0;
                    let memberUser = 0, memberStudent = 0, userStudent = 0, allThree = 0;
                    for (const [, p] of persons) {
                        const r = p.roles;
                        if (r.size === 3) {
                            allThree += 1;
                        } else if (r.has('member') && r.has('user')) {
                            memberUser += 1;
                        } else if (r.has('member') && r.has('student')) {
                            memberStudent += 1;
                        } else if (r.has('user') && r.has('student')) {
                            userStudent += 1;
                        } else if (r.has('member')) {
                            membersCount += 1;
                        } else if (r.has('student')) {
                            studentsCount += 1;
                        } else if (r.has('user')) {
                            usersCount += 1;
                        }
                    }

                    // include exclusive counts plus overlaps as separate indicators
                    setUsers(usersCount);
                    setMembers(membersCount);
                    setStudents(studentsCount);
                    setOverlaps({ memberUser, memberStudent, userStudent, allThree });
                    setBlogs(blogsResponse?.data || []);
                } else {
                    const response = await axiosSecure.get('/blogs/me', { withCredentials: true });
                    if (!active) return;
                    setBlogs(response?.data || []);
                }
            } catch (error) {
                if (active) {
                    toast.error(error?.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        if (authLoading || isAdminLoading) {
            setLoading(true);
            return () => {
                active = false;
            };
        }

        setLoading(true);
        loadTotals();

        return () => {
            active = false;
        };
    }, [axiosSecure, authLoading, isAdmin, isAdminLoading]);

    const blogSummary = useMemo(() => {
        return blogs.reduce((accumulator, blog) => {
            accumulator.total += 1;
            accumulator[blog?.status || 'pending'] = (accumulator[blog?.status || 'pending'] || 0) + 1;
            return accumulator;
        }, { total: 0, pending: 0, approved: 0, declined: 0 });
    }, [blogs]);

    const engagement = useMemo(() => {
        return blogs.reduce((acc, b) => {
            acc.views += Number(b?.views || 0);
            acc.likes += Number(b?.likes || 0);
            acc.comments += Number(b?.comments || 0);
            return acc;
        }, { views: 0, likes: 0, comments: 0 });
    }, [blogs]);

    const topPosts = useMemo(() => {
        return [...blogs].sort((a, b) => (Number(b?.views || 0) - Number(a?.views || 0))).slice(0, 3);
    }, [blogs]);

    const recentActivity = useMemo(() => {
        return [...blogs].sort((a, b) => new Date(b?.updatedAt || b?.createdAt || 0) - new Date(a?.updatedAt || a?.createdAt || 0)).slice(0, 6).map(b => {
            const time = b?.updatedAt || b?.createdAt;
            const when = time ? new Date(time).toLocaleString() : 'recently';
            let message = '';
            if (b?.status === 'approved') message = `Your post "${b?.title}" was approved`;
            else if (b?.status === 'declined') message = `Your post "${b?.title}" was declined`;
            else if (b?.status === 'pending') message = `You submitted "${b?.title}" for review`;
            return { id: b?._id, when, message };
        });
    }, [blogs]);

    const adminBlogSummary = useMemo(() => {
        return blogs.reduce((accumulator, blog) => {
            accumulator.total += 1;
            accumulator[blog?.status || 'pending'] = (accumulator[blog?.status || 'pending'] || 0) + 1;
            return accumulator;
        }, { total: 0, pending: 0, approved: 0, declined: 0 });
    }, [blogs]);

    const peopleTotal = Number(users || 0) + Number(members || 0) + Number(students || 0);
    const peopleMix = [
        { label: 'Users', value: Number(users || 0), color: 'bg-[#E97451]' },
        { label: 'Members', value: Number(members || 0), color: 'bg-amber-500' },
        { label: 'Students', value: Number(students || 0), color: 'bg-stone-900' },
    ];

    const blogMix = [
        { label: 'Pending', value: Number(adminBlogSummary.pending || 0), color: 'bg-amber-500' },
        { label: 'Approved', value: Number(adminBlogSummary.approved || 0), color: 'bg-emerald-500' },
        { label: 'Declined', value: Number(adminBlogSummary.declined || 0), color: 'bg-rose-500' },
    ];

    const approvalRate = adminBlogSummary.total > 0 ? Math.round((adminBlogSummary.approved / adminBlogSummary.total) * 100) : 0;

    return (
        <>
            {
                !loading ? <div className='w-full px-4'>
                    <title>Overview | Dashboard - Rewaz</title>
                    {isAdmin ? (
                        <div className='mx-auto my-12 max-w-7xl space-y-6 px-4'>
                            <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                                <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>Administration</p>
                                <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                                    <div>
                                        <h2 className='flex items-center gap-2 text-3xl font-bold'><RiDashboard3Line /> Overview</h2>
                                        <p className='mt-2 max-w-2xl text-sm text-white/75'>A quick snapshot of people, student registrations, and blog moderation status across the system.</p>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3 text-sm md:grid-cols-4'>
                                        <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Users <span className='block text-2xl font-bold'>{rawUsers ?? users}</span></div>
                                        <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Members <span className='block text-2xl font-bold'>{rawMembers ?? members}</span></div>
                                        <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Students <span className='block text-2xl font-bold'>{rawStudents ?? students}</span></div>
                                        <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>Blogs <span className='block text-2xl font-bold'>{adminBlogSummary.total}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-4 md:grid-cols-3 items-stretch'>
                                {[
                                    { label: 'Total Users', value: rawUsers ?? users, image: usersPhoto, accent: 'border-pink-900' },
                                    { label: 'Total Members', value: rawMembers ?? members, image: memberPhoto, accent: 'border-red-400' },
                                    { label: 'Total Students', value: rawStudents ?? students, image: studentPhoto, accent: 'border-blue-400' },
                                ].map((item) => (
                                    <div key={item.label} className={`rounded-2xl border-l-4 ${item.accent} bg-gradient-to-br from-white to-stone-50 p-6 shadow-sm flex justify-center items-center h-full`}>
                                        <div className='w-full flex flex-col justify-between h-full'>
                                            <div className='flex justify-between items-center'>
                                                <div>
                                                    <h1 className='text-5xl font-bold text-[#E97451]'>{item.value}</h1>
                                                    <h5 className='font-semibold'>{item.label}</h5>
                                                </div>
                                                <img src={item.image} alt="" className='max-w-[100px]' />
                                            </div>
                                            <div className='mt-4 h-2 overflow-hidden rounded-full bg-stone-200'>
                                                <div className='h-full rounded-full bg-gradient-to-r from-[#E97451] to-[#D26B2E]' style={{ width: `${peopleTotal ? Math.max(18, Math.min(100, Math.round((Number(item.value || 0) / peopleTotal) * 100))) : 0}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-stretch'>
                                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] h-full flex flex-col justify-between'>
                                    <div className='flex flex-wrap items-end justify-between gap-3'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-stone-900'>People mix</h3>
                                            <p className='text-sm text-stone-500'>How the current admin-owned population is split.</p>
                                        </div>
                                        <p className='text-sm font-semibold text-stone-700'>Total people: {peopleTotal}</p>
                                    </div>
                                    <div className='mt-5 space-y-4'>
                                        {peopleMix.map((item) => {
                                            const share = peopleTotal ? Math.round((item.value / peopleTotal) * 100) : 0;
                                            return (
                                                <div key={item.label}>
                                                    <div className='mb-2 flex items-center justify-between text-sm'>
                                                        <span className='font-medium text-stone-700'>{item.label}</span>
                                                        <span className='text-stone-500'>{item.value} ({share}%)</span>
                                                    </div>
                                                    <div className='h-3 overflow-hidden rounded-full bg-stone-100'>
                                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${share}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className='mt-3 border-t pt-3'>
                                            <div className='flex items-center gap-3 text-sm text-stone-600'>
                                                <div className='flex gap-2 items-center'>
                                                    <span className='font-medium'>Overlaps</span>
                                                    <FiInfo className='text-stone-400' title={'Overlaps are counted when the same person appears in multiple collections. Matching uses email (preferred), then phone, then studentId. Primary role priority for display is Member > Student > User.'} />
                                                </div>
                                                <div className='ml-auto flex gap-3'>
                                                    <span className='inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs'>Member+User: <strong className='ml-1'>{overlaps.memberUser}</strong></span>
                                                    <span className='inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs'>Member+Student: <strong className='ml-1'>{overlaps.memberStudent}</strong></span>
                                                    <span className='inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs'>User+Student: <strong className='ml-1'>{overlaps.userStudent}</strong></span>
                                                    <span className='inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1 text-xs'>All three: <strong className='ml-1'>{overlaps.allThree}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] h-full flex flex-col justify-between'>
                                    <div className='flex flex-wrap items-end justify-between gap-3'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-stone-900'>Blog moderation</h3>
                                            <p className='text-sm text-stone-500'>Approval health and queue balance.</p>
                                        </div>
                                        <div className='rounded-full bg-[#fff4ef] px-3 py-1 text-sm font-semibold text-[#D26B2E]'>Approval rate {approvalRate}%</div>
                                    </div>
                                    <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                                        <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
                                            <p className='text-sm text-stone-500'>Pending queue</p>
                                            <h4 className='mt-1 text-3xl font-bold text-amber-600'>{adminBlogSummary.pending}</h4>
                                        </div>
                                        <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
                                            <p className='text-sm text-stone-500'>Reviewed</p>
                                            <h4 className='mt-1 text-3xl font-bold text-emerald-600'>{adminBlogSummary.approved + adminBlogSummary.declined}</h4>
                                        </div>
                                    </div>
                                    <div className='mt-5 h-3 overflow-hidden rounded-full bg-stone-100'>
                                        {blogMix.map((item, index) => {
                                            const width = adminBlogSummary.total ? (item.value / adminBlogSummary.total) * 100 : 0;
                                            return (
                                                <div
                                                    key={item.label}
                                                    className={`${item.color} h-full inline-block ${index === 0 ? 'rounded-l-full' : ''} ${index === blogMix.length - 1 ? 'rounded-r-full' : ''}`}
                                                    style={{ width: `${width}%` }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className='mt-4 flex flex-wrap gap-3 text-sm text-stone-600'>
                                        {blogMix.map((item) => (
                                            <span key={item.label} className='inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-1'>
                                                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                                {item.label}: {item.value}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-stretch'>
                                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] h-full flex flex-col justify-between'>
                                    <h3 className='text-lg font-semibold text-stone-900'>Blog status split</h3>
                                    <div className='mt-5 space-y-4'>
                                        {blogMix.map((item) => {
                                            const share = adminBlogSummary.total ? Math.round((item.value / adminBlogSummary.total) * 100) : 0;
                                            return (
                                                <div key={item.label}>
                                                    <div className='mb-2 flex items-center justify-between text-sm'>
                                                        <span className='font-medium text-stone-700'>{item.label}</span>
                                                        <span className='text-stone-500'>{item.value} ({share}%)</span>
                                                    </div>
                                                    <div className='h-3 overflow-hidden rounded-full bg-stone-100'>
                                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${share}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                    <h3 className='text-lg font-semibold text-stone-900'>Recent moderation activity</h3>
                                    <div className='mt-4 grid gap-3'>
                                        {blogs.slice(0, 5).map((blog) => (
                                            <div key={blog?._id} className='flex items-start justify-between gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-4'>
                                                <div className='min-w-0'>
                                                    <p className='font-semibold text-stone-900'>{blog?.title}</p>
                                                    <p className='mt-1 text-xs text-stone-500'>By {blog?.authorName || blog?.authorEmail}</p>
                                                    <p className='mt-2 text-sm text-stone-600 line-clamp-2'>{blog?.excerpt}</p>
                                                </div>
                                                <div className='flex shrink-0 flex-col items-end gap-2'>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${blog?.status === 'approved' ? 'bg-emerald-100 text-emerald-900' : blog?.status === 'declined' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'}`}>
                                                        {blog?.status || 'pending'}
                                                    </span>
                                                    <span className='text-xs text-stone-400'>{blog?.reviewedAt ? new Date(blog.reviewedAt).toLocaleDateString() : 'Awaiting review'}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {blogs.length === 0 ? <p className='text-sm text-stone-500'>No blog submissions yet.</p> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='mx-auto my-12 max-w-5xl space-y-6 px-4'>
                            <div className='rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-900 to-[#E97451] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]'>
                                <p className='text-xs uppercase tracking-[0.45em] text-amber-200'>User Dashboard</p>
                                <div className='mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
                                    <div>
                                        <h2 className='text-3xl font-bold'>Welcome back, {user?.displayName || user?.email}</h2>
                                        <p className='mt-2 max-w-2xl text-sm text-white/75'>
                                            Track the status of your blog submissions from here and jump back into the editor when you are ready.
                                        </p>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Link to='/blog' className='btn border-0 bg-white text-stone-900 hover:bg-stone-100'>Write blog</Link>
                                        <Link to='/dashboard/my-blogs' className='btn border-0 bg-[#E97451] text-white hover:bg-[#d8653f]'>View all</Link>
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-4 md:grid-cols-4'>
                                <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                                    <p className='text-sm text-stone-500'>Total</p>
                                    <h2 className='mt-2 text-3xl font-bold text-stone-900'>{blogSummary.total}</h2>
                                </div>
                                <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                                    <p className='text-sm text-stone-500'>Pending</p>
                                    <h2 className='mt-2 text-3xl font-bold text-amber-600'>{blogSummary.pending}</h2>
                                </div>
                                <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                                    <p className='text-sm text-stone-500'>Approved</p>
                                    <h2 className='mt-2 text-3xl font-bold text-emerald-600'>{blogSummary.approved}</h2>
                                </div>
                                <div className='rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur'>
                                    <p className='text-sm text-stone-500'>Declined</p>
                                    <h2 className='mt-2 text-3xl font-bold text-rose-600'>{blogSummary.declined}</h2>
                                </div>
                            </div>
                            <div className='grid gap-6 lg:grid-cols-3'>
                                <div className='col-span-2 space-y-4'>
                                    <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                        <h3 className='text-lg font-semibold text-stone-900'>Engagement</h3>
                                        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                                            <div className='rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-sm flex items-center gap-4'>
                                                <div className='rounded-lg bg-[#fff4ef] p-3 text-[#D26B2E]'>
                                                    <FiEye className='text-xl' />
                                                </div>
                                                <div>
                                                    <p className='text-sm text-stone-500'>Views</p>
                                                    <p className='text-xl font-bold'>{engagement.views}</p>
                                                </div>
                                            </div>
                                            <div className='rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-sm flex items-center gap-4'>
                                                <div className='rounded-lg bg-[#fff4ef] p-3 text-[#D26B2E]'>
                                                    <FiThumbsUp className='text-xl' />
                                                </div>
                                                <div>
                                                    <p className='text-sm text-stone-500'>Likes</p>
                                                    <p className='text-xl font-bold'>{engagement.likes}</p>
                                                </div>
                                            </div>
                                            <div className='rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-sm flex items-center gap-4'>
                                                <div className='rounded-lg bg-[#fff4ef] p-3 text-[#D26B2E]'>
                                                    <FiMessageCircle className='text-xl' />
                                                </div>
                                                <div>
                                                    <p className='text-sm text-stone-500'>Comments</p>
                                                    <p className='text-xl font-bold'>{engagement.comments}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                        <h3 className='text-lg font-semibold text-stone-900'>Your recent posts</h3>
                                        <div className='mt-4 space-y-3'>
                                            {blogs.slice(0,5).map(b => (
                                                <div key={b?._id} className='flex items-start justify-between gap-4 rounded-xl border border-stone-100 p-4'>
                                                    <div>
                                                        <h4 className='font-semibold text-stone-900'>{b?.title}</h4>
                                                        <p className='text-sm text-stone-500 mt-1'>{b?.excerpt}</p>
                                                        <div className='mt-2 flex items-center gap-3 text-xs text-stone-500'>
                                                            <span className='inline-flex items-center gap-1'><FiEye /> {b?.views || 0}</span>
                                                            <span className='inline-flex items-center gap-1'><FiThumbsUp /> {b?.likes || 0}</span>
                                                            <span className='inline-flex items-center gap-1'><FiMessageCircle /> {b?.comments || 0}</span>
                                                        </div>
                                                    </div>
                                                    <div className='text-right'>
                                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${b?.status === 'approved' ? 'bg-emerald-100 text-emerald-900' : b?.status === 'declined' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'}`}>
                                                            {b?.status || 'pending'}
                                                        </span>
                                                        <p className='text-xs text-stone-400 mt-2'>{new Date(b?.createdAt || b?.updatedAt || Date.now()).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <aside className='space-y-4'>
                                    <div className='rounded-3xl border border-stone-200 bg-gradient-to-br from-white to-[#fff4ef] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                        <h3 className='text-lg font-semibold text-stone-900'>Membership status</h3>
                                        <p className='mt-2 text-sm text-stone-600'>View your membership request and card details on the dedicated page.</p>
                                        <Link to='/dashboard/membership-status' className='btn mt-4 w-full border-0 bg-[#E97451] text-white hover:bg-[#d8653f]'>Open membership status</Link>
                                    </div>

                                    <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                        <h3 className='text-lg font-semibold text-stone-900'>Top posts</h3>
                                        <ul className='mt-4 space-y-3'>
                                            {topPosts.map(tp => (
                                                <li key={tp?._id} className='flex items-center justify-between gap-3'>
                                                    <div>
                                                        <p className='font-medium text-stone-900'>{tp?.title}</p>
                                                        <p className='text-xs text-stone-500'>{tp?.category} • {tp?.views || 0} views</p>
                                                    </div>
                                                    <Link to={`/dashboard/my-blogs`} className='btn btn-ghost btn-sm'>Manage</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className='rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                                        <h3 className='text-lg font-semibold text-stone-900'>Recent activity</h3>
                                        <ul className='mt-4 space-y-2'>
                                            {recentActivity.map(act => (
                                                <li key={act.id} className='flex items-start gap-3'>
                                                    <div className='rounded-full bg-stone-100 p-2 text-stone-600'><FiClock /></div>
                                                    <div>
                                                        <p className='text-sm text-stone-700'>{act.message}</p>
                                                        <p className='text-xs text-stone-400'>{act.when}</p>
                                                    </div>
                                                </li>
                                            ))}
                                            {recentActivity.length === 0 && <li className='text-sm text-stone-500'>No recent activity.</li>}
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    )}
                </div> : <>
                    <DashboardLoading title='Loading your dashboard' subtitle='Fetching counts, activity, and recent posts…' variant='progress' />
                </>
            }
            <ToastContainer />
        </>
    );
};

export default Overview;