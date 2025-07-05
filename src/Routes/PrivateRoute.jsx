import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import loader from '/images/loading.svg';

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <div className='min-h-screen flex flex-col justify-center items-center'>
            <img src={loader} alt="" />
            <h2 className='text-lg'>Loading...</h2>
        </div>
    }
    if (user) {
        return children;
    }
    return <Navigate state={location.pathname} to={'/login'} replace></Navigate>
};

export default PrivateRoute;