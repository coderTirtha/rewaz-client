import React from 'react';
import logo from '/images/logo.png';
import { Link } from 'react-router-dom';

const SignUp = () => {
    return (
        <div className='min-w-md mx-auto my-12 border-2 border-gray-200 p-6 rounded'>
            <title>Sign Up | Rewaz</title>
            <div className='my-4 space-y-4'>
                <div className='flex justify-center items-center'>
                    <img src={logo} alt="" className='w-[100px]' />
                </div>
                <h1 className='text-4xl font-bold text-center'>Sign Up</h1>
            </div>
            <div className='max-w-md'>
                <form className='space-y-4'>
                    <div className='space-y-2'>
                        <label className="label">Name</label>
                        <input type="text" className="input validator w-full" placeholder="Name" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Email</label>
                        <input type="email" className="input validator w-full" placeholder="Email" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Phone</label>
                        <input type="tel" className="input validator w-full" placeholder="Phone" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Password</label>
                        <input type="password" className="input validator w-full" placeholder="Password" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Confirm Password</label>
                        <input type="password" className="input validator w-full" placeholder="Confirm Password" required />
                    </div>
                    <input type="submit" value="Sign Up" className='btn btn-outline text-[#E97451] border-[#E97451] hover:bg-[#E97451] hover:text-white w-full my-2' />
                </form>
                <p className='text-center my-2'>Already have an account? <Link to={'/login'}><span className='text-[#E97451] hover:underline'>Login</span></Link></p>
            </div>
        </div>
    );
};

export default SignUp;