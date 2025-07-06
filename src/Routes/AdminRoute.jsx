import React from 'react';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';
import loader from '/images/loading.svg';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const location = useLocation();
    if (loading || isAdminLoading) {
        return <div className='min-h-screen flex flex-col justify-center items-center'>
            <img src={loader} alt="" />
            <h2 className='text-lg'>Loading...</h2>
        </div>
    }
    if (user && isAdmin) {
        return children;
    }
    return <Navigate to={'/'} state={{ from: location }} replace></Navigate>
};

export default AdminRoute;