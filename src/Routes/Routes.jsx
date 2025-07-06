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
import PendingMembers from "../Pages/Dashboard_PendingMembers/PendingMembers";

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
                path: '/blog',
                element: <PrivateRoute><Blog /></PrivateRoute>
            },
            {
                path: '/profile/:uid',
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
            {
                path: '/membership-form',
                element: <PrivateRoute><Membership /></PrivateRoute>
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
                path: '/dashboard/pending-members',
                element: <AdminRoute><PendingMembers /></AdminRoute>
            }
        ]
    }
]);

export default routes;