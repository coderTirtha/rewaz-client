import React from 'react';
import errorImage from '/images/error.gif';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className='page-surface flex h-screen flex-col items-center justify-center px-4'>
            <title>404 | Page not Found</title>
            <div className='surface-card flex max-w-2xl flex-col items-center gap-4 p-8 text-center'>
                <img src={errorImage} alt="" className='max-w-[300px]' />
                <p className='text-center text-gray-500'>We're sorry, but the page you are looking for doesn't exist or has been moved/under development.

                    <br />Please check the URL for errors or return to the <Link to={'/'} className='underline text-[#E97451]'>Home Page</Link> / <Link to={'/dashboard/overview'} className='underline text-[#E97451]'>Dashboard</Link> to continue browsing.

                    <br />If you believe this is an error, feel free to contact <Link to={'/support'} className='underline text-[#E97451]'>Support</Link></p>
            </div>
        </div>
    );
};

export default Error;