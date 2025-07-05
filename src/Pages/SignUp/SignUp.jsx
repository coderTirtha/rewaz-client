import React from 'react';
import logo from '/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast, ToastContainer } from 'react-toastify';

const SignUp = () => {
    const { createUser } = useAuth();
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const onSubmit = (data) => {
        createUser(data?.email, data?.password)
        .then(response => {
            const newUser = {
                name: data?.name,
                email: data?.email,
                phone: data?.phone,
                userId: response?.user?.uid,
                role: 'user'
            }
            axiosSecure.post('/users', newUser, {withCredentials: true})
            .then(resData => {
                if(resData?.data?.insertedId) {
                    toast.success('User profile created successfully');
                    reset();
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
        })
        .catch(error => {
            toast.error(error.message);
        })
    }
    return (
        <div className='max-w-xs md:min-w-md mx-auto my-12 border-2 border-gray-200 p-6 rounded'>
            <title>Sign Up | Rewaz</title>
            <div className='my-4 space-y-4'>
                <div className='flex justify-center items-center'>
                    <img src={logo} alt="" className='w-[100px]' />
                </div>
                <h1 className='text-4xl font-bold text-center'>Sign Up</h1>
            </div>
            <div className='max-w-md'>
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-2'>
                        <label className="label">Name</label>
                        <input {...register('name', { required: true })} type="text" className="input validator w-full" placeholder="Name" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Email</label>
                        <input {...register('email', { required: true })} type="email" className="input validator w-full" placeholder="Email" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Phone</label>
                        <input {...register('phone', { required: true })} type="tel" className="input validator w-full" placeholder="Phone" required />
                    </div>
                    <div className='space-y-2'>
                        <label className="label">Password</label>
                        <input {...register('password', { required: true })} type="password" className="input validator w-full" placeholder="Password" required />
                    </div>
                    <input type="submit" value="Sign Up" className='btn btn-outline text-[#E97451] border-[#E97451] hover:bg-[#E97451] hover:text-white w-full my-2' />
                </form>
                <p className='text-center my-2'>Already have an account? <Link to={'/login'}><span className='text-[#E97451] hover:underline'>Login</span></Link></p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignUp;