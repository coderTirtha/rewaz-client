import React from 'react';
import logo from '/images/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
    const { login } = useAuth();
    const { register, handleSubmit, reset } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const onSubmit = (data) => [
        login(data?.email, data?.password)
        .then(res => {
            toast.success('Logged in Successfully!');
            reset();
            setTimeout(() => {
                navigate(location?.state || '/')
            }, 2000);
        })
        .catch(err => {
            toast.error(err.message);
            reset();
        })
    ]
    return (
        <div className='my-12 max-w-xs md:min-w-md mx-auto border-2 border-gray-200 p-6 rounded'>
            <title>Login | Rewaz</title>
            <div className='flex justify-center items-center'>
                <img src={logo} alt="" className='w-[150px]' />
            </div>
            <div className='my-6'>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-4xl font-bold uppercase'>Login</h1>
                </div>
                <div className='flex justify-center items-center my-6'>
                    <div className='max-w-md'>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <label className="label">Email</label>
                            <input {...register("email", { required: true })} type="email" className="input validator w-full" placeholder="Email" required />
                            <label className="label">Password</label>
                            <input {...register("password", { required: true })} type="password" className="input w-full" placeholder="Password" required />
                            <div className='w-full text-center'><a className="link link-hover text-gray-400">Forgot password?</a></div>
                            <input type="submit" value="Login" className='btn btn-outline text-[#E97451] border-[#E97451] hover:bg-[#E97451] hover:text-white w-full' />
                        </form>
                        <p className='text-center my-2'>Don't have an account? <Link to={'/signup'}><span className='text-[#E97451] hover:underline'>Sign Up</span></Link></p>
                    </div>
                </div>
            </div>
        <ToastContainer />
        </div>
    );
};

export default Login;