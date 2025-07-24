import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Blog from "../Pages/Blog/Blog";
import PrivateRoute from "./PrivateRoute";
import Profile from "../Pages/Profile/Profile";
import Membership from "../Pages/Membership/Membership";
import AdminRoute from "./AdminRoute";
import Dashboard from "../Layouts/Dashboard";
import Overview from "../Pages/Dashboard_Overview/Overview";
import ManageUsers from "../Pages/Dashboard_ManageUsers/ManageUsers";
import ManageMembers from "../Pages/Dashboard_ManageMembers/ManageMembers";
import Donation from "../Pages/Donation/Donation";
import MemberDetails from "../Pages/MemberDetails/MemberDetails";
import Manage_Students from "../Pages/Dashboard_ManageStudents/Manage_Students";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        errorElement: <Error />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <SignUp />
            },
            {
                path: '/donate',
                element: <PrivateRoute><Donation /></PrivateRoute>
            },
            {
                path: '/blog',
                element: <PrivateRoute><Blog /></PrivateRoute>
            },
            {
                path: '/profile/:uid',
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
            {
                path: '/membership',
                element: <PrivateRoute><Membership /></PrivateRoute>
            },
            {
                path: '/member/:membershipId',
                element: <AdminRoute><MemberDetails /></AdminRoute>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <AdminRoute><Dashboard /></AdminRoute>,
        children: [
            {
                index: true,
                element: <AdminRoute><Overview /></AdminRoute>
            },
            {
                path: 'overview',
                element: <AdminRoute><Overview /></AdminRoute>
            },
            {
                path: '/dashboard/manage-users',
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: '/dashboard/manage-members',
                element: <AdminRoute><ManageMembers /></AdminRoute>
            },
            {
                path: '/dashboard/manage-students',
                element: <AdminRoute><Manage_Students /></AdminRoute>
            }
        ]
    }
]);

export default routes;