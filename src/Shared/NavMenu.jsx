import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '/images/logo.png';
import { IoHome, IoMenu } from 'react-icons/io5';
import { BiDonateHeart } from 'react-icons/bi';

const NavMenu = () => {
    const menuItems = <>
        <li><NavLink to={'/'}><IoHome />Home</NavLink></li>
        <li><NavLink to={'/donate'}><BiDonateHeart />Donation</NavLink></li>
    </>
    return (
        <div>
            <div className="drawer">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-200 w-full">
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
                            <Link to={'/login'}><button className='btn btn-sm lg:btn-md bg-[#E97451] text-white'>Login</button></Link>
                            <button className='btn btn-sm lg:btn-md btn-outline border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:border-[#1C1C1C] hover:text-white'>Sign Up</button>
                        </div>
                    </div>
                    {/* Page content here */}
                    <Outlet />
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-72 p-4 flex flex-col justify-between">
                        {/* Sidebar content here */}
                        <div className='flex flex-col justify-around items-center gap-2 py-6'>
                            <img src={logo} alt="" className='w-[80px]' />
                            <h1 className='text-xl font-semibold'>Rewaz</h1>
                            <p className='px-2 text-justify'>A renowned Tabla learning school conducted by Pandit Sudip Sen Gupta from Chittagong, Bangladesh</p>
                        </div>
                        <div>
                            {menuItems}
                        </div>
                        <div>

                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavMenu;