import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import DashboardLoading from '../Shared/DashboardLoading';

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <DashboardLoading title='Preparing your private workspace' subtitle='Loading your secure session…' variant='progress' />
    }
    if (user) {
        return children;
    }
    return <Navigate state={location.pathname} to={'/login'} replace></Navigate>
};

export default PrivateRoute;