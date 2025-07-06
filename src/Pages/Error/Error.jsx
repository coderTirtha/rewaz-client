import React from 'react';
import errorImage from '/images/error.gif';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <title>404 | Page not Found</title>
            <img src={errorImage} alt="" className='max-w-[300px]' />
            <p className='text-center text-gray-500'>We're sorry, but the page you are looking for doesn't exist or has been moved/under development.

                <br />Please check the URL for errors or return to the <Link to={'/'} className='underline text-[#E97451]'>Home Page</Link> / <Link to={'/dashboard/overview'} className='underline text-[#E97451]'>Dashboard</Link> to continue browsing.

                <br />If you believe this is an error, feel free to contact <Link to={'/support'} className='underline text-[#E97451]'>Support</Link></p>
        </div>
    );
};

export default Error;