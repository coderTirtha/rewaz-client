import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '/images/logo.png';
import userAvatar from '/images/user.png';
import { IoHome, IoMenu } from 'react-icons/io5';
import { BiDonateHeart } from 'react-icons/bi';
import { FaBlog } from 'react-icons/fa';
import { SlBadge } from 'react-icons/sl';
import useAuth from '../hooks/useAuth';
import { LuLayoutDashboard } from 'react-icons/lu';
import useAdmin from '../hooks/useAdmin';
import loader from '/images/loading.svg';

const NavMenu = () => {
    const { user, loading } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const [scrolled, setScrolled] = useState();
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const menuItems = <>
        <li><NavLink to={'/'}><IoHome />Home</NavLink></li>
        <li><NavLink to={'/donate'}><BiDonateHeart />Donation</NavLink></li>
        <li><NavLink to={'/blog'}><FaBlog />Blog</NavLink></li>
        <li><NavLink to={'/membership'}><SlBadge />Membership</NavLink></li>
        {
            loading || isAdminLoading ? <><div className='min-h-screen flex flex-col justify-center items-center'>
                <img src={loader} alt="" />
                <h2 className='text-lg'>Loading...</h2>
            </div></> :
                user && isAdmin ? <li><NavLink to={'/dashboard/overview'}><LuLayoutDashboard />Dashboard</NavLink></li> : ''
        }
    </>
    return (
        <div>
            {
                loading || isAdminLoading ? <>
                    <div className='min-h-screen flex flex-col justify-center items-center'>
                        <img src={loader} alt="" />
                        <h2 className='text-lg'>Loading...</h2>
                    </div>
                </> :
                    <div className="drawer">
                        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex flex-col">
                            {/* Navbar */}
                            <div className={`navbar bg-base-200 w-full fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${scrolled ? "bg-white/80 text-black backdrop-blur-lg shadow-lg" : "bg-black/50 text-white backdrop-blur-sm"}`}>
                                <div className="flex-none lg:hidden">
                                    <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                        <IoMenu className='text-xl' />
                                    </label>
                                </div>
                                <div className="mx-2 flex flex-1 px-2 items-center gap-4">
                                    <img src={logo} alt="" className='w-[45px]' />
                                    <h1 className='text-xl font-semibold'>Rewaz</h1>
                                </div>
                                <div className="hidden flex-none lg:block">
                                    <ul className="menu menu-horizontal gap-1">
                                        {/* Navbar menu content here */}
                                        {menuItems}
                                    </ul>
                                </div>
                                <div className='flex gap-2 lg:gap-4'>
                                    {
                                        user ? <>
                                            <Link to={`/profile/${user?.uid}`}>
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full">
                                                        <img src={user?.photoURL ? user?.photoURL : userAvatar} className='max-w-[100px]' />
                                                    </div>
                                                </div>
                                            </Link>
                                        </> :
                                            <>
                                                <Link to={'/login'}><button className='btn btn-sm lg:btn-md bg-[#E97451] text-white border-0 shadow-none'>Login</button></Link>
                                                <Link to={'/signup'}><button className='btn btn-sm lg:btn-md btn-outline border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:border-[#1C1C1C] hover:text-white'>Sign Up</button></Link>
                                            </>
                                    }
                                </div>
                            </div>
                            {/* Page content here */}
                            <Outlet />
                        </div>
                        <div className="drawer-side fixed top-0 left-0 z-[100]">
                            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu bg-base-200 min-h-full w-72 p-4 flex flex-col justify-between">
                                {/* Sidebar content here */}
                                <div className='flex flex-col justify-around items-center gap-2 py-6'>
                                    <img src={logo} alt="" className='w-[80px]' />
                                    <h1 className='text-xl font-semibold'>Rewaz</h1>
                                    <p className='px-2 text-justify'>A renowned Tabla learning school conducted by Pandit Sudip Sen Gupta from Chittagong, Bangladesh</p>
                                </div>
                                <div className='flex-grow'>
                                    {menuItems}
                                </div>
                                <div>

                                </div>
                            </ul>
                        </div>
                    </div>
            }
        </div>
    );
};

export default NavMenu;