import React from 'react';
import { GrOverview } from 'react-icons/gr';
import { RiPassPendingFill } from 'react-icons/ri';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '/images/logo.png';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoHomeOutline } from 'react-icons/io5';
import { MdCardMembership } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { FaUsersGear } from 'react-icons/fa6';
import { LuLogs } from 'react-icons/lu';
import { FaBookOpen } from 'react-icons/fa6';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';

const Dashboard = () => {
    const { user } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const dashboardItems = <>
        <li><NavLink to="/dashboard/overview"><GrOverview />Overview</NavLink></li>
        {!isAdminLoading && <li><NavLink to="/dashboard/membership-status"><MdCardMembership />Membership Status</NavLink></li>}
        <li><NavLink to="/dashboard/my-blogs"><FaBookOpen />My Blogs</NavLink></li>
        {
            !isAdminLoading && isAdmin && <>
                <li><NavLink to="/dashboard/manage-blogs"><RiPassPendingFill />Manage Blogs</NavLink></li>
                <li><NavLink to="/dashboard/manage-users"><FaUsersGear />Manage Users</NavLink></li>
                <li><NavLink to="/dashboard/manage-members"><MdCardMembership />Manage Members</NavLink></li>
                <li><NavLink to="/dashboard/manage-students"><PiStudent />Manage Students</NavLink></li>
                <li><NavLink to="/dashboard/donation-logs"><LuLogs />Donation Logs</NavLink></li>
            </>
        }
    </>
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center page-surface">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-2" className="btn btn-outline btn-sm text-2xl drawer-button fixed top-2 right-2 lg:hidden brand-button-outline">
                        <AiOutlineMenuFold />
                    </label>
                    <Outlet />
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu min-h-full w-72 border-r border-stone-200 bg-white p-4 text-stone-800 shadow-[0_20px_60px_rgba(15,23,42,0.12)] flex flex-col justify-around gap-y-10">
                        <div className='flex flex-col items-center justify-center space-y-4 py-6 text-center'>
                            <img src={logo} alt="" className='max-w-[150px] drop-shadow-lg' />
                            <h2 className='text-xl font-bold uppercase tracking-[0.25em] text-[#1C1C1C]'>Admin Dashboard</h2>
                            <p className='text-xs text-stone-500'>{user?.displayName || user?.email}</p>
                        </div>
                        {/* Sidebar content here */}
                        <div className='flex-grow'>
                            {dashboardItems}
                        </div>
                        <div>
                            <li>
                                <NavLink to={'/'} className='btn btn-outline btn-sm brand-button-outline'>
                                   <IoHomeOutline />Go Back to Home
                                </NavLink>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;