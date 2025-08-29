import React from 'react';
import { GrOverview } from 'react-icons/gr';
import { RiPassPendingFill } from 'react-icons/ri';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '/images/logo.png';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoHomeOutline } from 'react-icons/io5';
import { MdCardMembership, MdOutlinePendingActions } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { FaUsersGear } from 'react-icons/fa6';
import { LuLogs } from 'react-icons/lu';
import useAdmin from '../hooks/useAdmin';

const Dashboard = () => {
    const {isAdmin, isAdminLoading} = useAdmin();
    const dashboardItems = <>
        <li><NavLink to="/dashboard/overview"><GrOverview />Overview</NavLink></li>
        {
            isAdmin && !isAdminLoading && <>
                <li><NavLink to="/dashboard/manage-users"><FaUsersGear />Manage Users</NavLink></li>
                <li><NavLink to="/dashboard/manage-members"><MdCardMembership />Manage Members</NavLink></li>
                <li><NavLink to="/dashboard/manage-students"><PiStudent />Manage Students</NavLink></li>
                <li><NavLink to="/dashboard/manage-blogs"><MdOutlinePendingActions />Manage Blogs</NavLink></li>
                <li><NavLink to="/dashboard/donation-logs"><LuLogs />Donation Logs</NavLink></li>
            </>
        }
    </>
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-2" className="btn btn-outline btn-sm text-2xl drawer-button fixed top-2 right-2 lg:hidden">
                        <AiOutlineMenuFold />
                    </label>
                    <Outlet />
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-[#707070] text-white min-h-full w-64 p-4 flex flex-col justify-around gap-y-10">
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            <img src={logo} alt="" className='max-w-[150px]' />
                            <h2 className='text-xl font-bold uppercase'>Admin Dashboard</h2>
                        </div>
                        {/* Sidebar content here */}
                        <div className='flex-grow'>
                            {dashboardItems}
                        </div>
                        <div>
                            <li>
                                <NavLink to={'/'} className='btn btn-outline btn-sm'>
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