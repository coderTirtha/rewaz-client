import React from 'react';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';
import DashboardLoading from '../Shared/DashboardLoading';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const location = useLocation();
    if (loading || isAdminLoading) {
        return <DashboardLoading title='Loading admin controls' subtitle='Checking permissions and syncing data…' variant='progress' />
    }
    if (user && isAdmin) {
        return children;
    }
    return <Navigate to={'/'} state={{ from: location }} replace></Navigate>
};

export default AdminRoute;