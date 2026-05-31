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
import { IoHomeOutline } from 'react-icons/io5';
import loader from '/images/loading.svg';

const NavMenu = () => {
    const { user, loading } = useAuth();
    const [scrolled, setScrolled] = useState();
    const menuLinkClass = ({ isActive }) =>
        `group flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E97451]/25 hover:bg-[#fff7f3] hover:text-[#E97451] ${isActive
            ? 'border-[#E97451]/25 bg-gradient-to-r from-[#fff4ef] to-white text-[#D26B2E] shadow-sm'
            : 'border-transparent text-stone-600'
        }`;
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = <>
        <li><NavLink to={'/'} className={menuLinkClass}><IoHome />Home</NavLink></li>
        <li><NavLink to={'/donate'} className={menuLinkClass}><BiDonateHeart />Donation</NavLink></li>
        <li><NavLink to={'/blogs-feed'} className={menuLinkClass}><FaBlog />Blogs Feed</NavLink></li>
        <li><NavLink to={'/membership'} className={menuLinkClass}><SlBadge />Membership</NavLink></li>
        {user ? <li><NavLink to={'/dashboard/overview'} className={menuLinkClass}><LuLayoutDashboard />Dashboard</NavLink></li> : null}
    </>

    return (
        <div>
            {loading ? (
                <div className='flex min-h-screen flex-col items-center justify-center bg-white'>
                    <img src={loader} alt="" />
                    <h2 className='text-lg'>Loading...</h2>
                </div>
            ) : (
                <div className="drawer">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        <div className={`navbar fixed left-0 right-0 top-0 z-10 w-full transition-all duration-300 ${scrolled ? "border-b border-stone-200 bg-white/85 text-black shadow-[0_14px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl" : "bg-black/55 text-white backdrop-blur-md"}`}>
                            <div className="flex-none lg:hidden">
                                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                    <IoMenu className='text-xl' />
                                </label>
                            </div>
                            <div className="mx-2 flex flex-1 items-center gap-4 px-2">
                                <img src={logo} alt="" className='w-[45px]' />
                                <div>
                                    <h1 className='text-xl font-semibold tracking-wide'>Rewaz</h1>
                                    <p className={`text-xs ${scrolled ? 'text-stone-500' : 'text-white/70'}`}>Tabla learning school</p>
                                </div>
                            </div>
                            <div className="hidden flex-1 justify-center lg:flex">
                                <ul className="menu menu-horizontal gap-2 rounded-full border border-stone-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-md">
                                    {menuItems}
                                </ul>
                            </div>
                            <div className='ml-auto flex items-center gap-3 pl-2 lg:gap-4 lg:pl-4'>
                                
                                {user ? (
                                    <Link to={`/profile/${user?.uid}`}>
                                        <div className="avatar rounded-full ring-2 ring-[#E97451]/15 transition hover:-translate-y-0.5 hover:ring-[#E97451]/30">
                                            <div className="w-10 rounded-full">
                                                <img src={user?.photoURL ? user?.photoURL : userAvatar} className='max-w-[100px]' />
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to={'/login'}><button className='btn btn-sm lg:btn-md brand-button'>Login</button></Link>
                                        <Link to={'/signup'}><button className='btn btn-sm lg:btn-md brand-button-outline'>Sign Up</button></Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <Outlet />
                    </div>
                    <div className="drawer-side fixed left-0 top-0 z-[100]">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu flex min-h-full w-72 flex-col justify-between border-r border-stone-200 bg-white p-4 text-stone-800 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                            <div className='flex flex-col items-center justify-around gap-3 py-6 text-center'>
                                <img src={logo} alt="" className='w-[88px] drop-shadow-lg' />
                                <h1 className='text-xl font-semibold tracking-wide text-[#1C1C1C]'>Rewaz</h1>
                                <p className='px-2 text-justify text-sm text-stone-600'>A renowned Tabla learning school conducted by Pandit Sudip Sen Gupta from Chittagong, Bangladesh</p>
                            </div>
                            <div className='flex-grow'>
                                {menuItems}
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
            )}
        </div>
    );
};

export default NavMenu;