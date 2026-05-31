import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Blog from "../Pages/Blog/Blog";
import BlogFeed from "../Pages/BlogFeed/BlogFeed";
import PrivateRoute from "./PrivateRoute";
import Profile from "../Pages/Profile/Profile";
import Membership from "../Pages/Membership/Membership";
import AdminRoute from "./AdminRoute";
import Dashboard from "../Layouts/Dashboard";
import Overview from "../Pages/Dashboard_Overview/Overview";
import MembershipStatus from "../Pages/Dashboard_MembershipStatus/MembershipStatus";
import MyBlogs from "../Pages/Dashboard_MyBlogs/MyBlogs";
import ManageUsers from "../Pages/Dashboard_ManageUsers/ManageUsers";
import ManageMembers from "../Pages/Dashboard_ManageMembers/ManageMembers";
import ManageBlogs from "../Pages/Dashboard_ManageBlogs/ManageBlogs";
import Donation from "../Pages/Donation/Donation";
import MemberDetails from "../Pages/MemberDetails/MemberDetails";
import Manage_Students from "../Pages/Dashboard_ManageStudents/Manage_Students";
import TermsAndConditions from "../Pages/Terms&Conditions/TermsAndConditions";
import MembershipPolicy from "../Pages/MembershipPolicy/MembershipPolicy";
import AddStudent from "../Pages/Dashboard_AddStudent/AddStudent";
import StudentDetails from "../Pages/Dashboard_StudentDetails/StudentDetails";

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
                path: '/terms-and-conditions',
                element: <TermsAndConditions />
            },
            {
                path: '/membership-policy',
                element: <MembershipPolicy />
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
                path: '/blogs-feed',
                element: <PrivateRoute><BlogFeed /></PrivateRoute>
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
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <Overview />
            },
            {
                path: 'overview',
                element: <Overview />
            },
            {
                path: 'membership-status',
                element: <MembershipStatus />
            },
            {
                path: 'my-blogs',
                element: <MyBlogs />
            },
            {
                path: 'manage-users',
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: 'manage-members',
                element: <AdminRoute><ManageMembers /></AdminRoute>
            },
            {
                path: 'manage-students',
                element: <AdminRoute><Manage_Students /></AdminRoute>
            },
            {
                path: 'manage-blogs',
                element: <AdminRoute><ManageBlogs /></AdminRoute>
            },
            {
                path: 'add-student',
                element: <AdminRoute><AddStudent /></AdminRoute>
            },
            {
                path: 'student-details/:studentId',
                element: <AdminRoute><StudentDetails /></AdminRoute>
            }
        ]
    }
]);

export default routes;