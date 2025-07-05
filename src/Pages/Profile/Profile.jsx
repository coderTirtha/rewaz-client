import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import userAvatar from '/images/user.png';
import { AiFillEdit, AiOutlinePicture, AiOutlineSave } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const Profile = () => {
    const { uid } = useParams();
    const [photo, setPhoto] = useState(null);
    const [editStatus, setEditStatus] = useState(false);
    const { register, handleSubmit } = useForm();
    const axiosSecure = useAxiosSecure();
    const { user, updateUser, logOut } = useAuth();
    const { data: userProfile, isLoading, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${uid}`);
            return res.data;
        },
    });
    const handleEdit = () => {
        setEditStatus(true);
        toast('You can now edit your credentials!');
    }
    const optimizePhoto = (url) => {
        return url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,g_auto/');
    }
    const onSubmit = async (data) => {
        const updatedProfile = {
            name: data?.name,
            phone: data?.phone,
            address: data?.address
        }
        try {
            await updateUser(updatedProfile.name, user?.photoURL);
            const res = await axiosSecure.patch(`/user/${uid}`, updatedProfile, { withCredentials: true });
            console.log(res.data);
            if (res.data.modifiedCount || res.data.matchedCount > 0) {
                toast.success('Profile updated successfully!');
                refetch();
                setEditStatus(false);
            }
        } catch (error) {
            toast.error(error?.message);
        }
    }
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
    }
    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!photo) {
            toast.error('Please select a photo to upload');
            return;
        }
        const formData = new FormData();
        formData.append('photo', photo);
        try {
            const resp = await axiosSecure.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (resp.data?.url) {
                const optimizedURL = optimizePhoto(resp.data?.url);
                updateUser(userProfile?.name, optimizedURL)
                    .then(async (res) => {
                        toast.success('Photo uploaded successfully!')
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    })
                    .catch(bug => {
                        toast.error(bug.message);
                    })
            }
        }
        catch (error) {
            toast.error('Failed to upload photo');
            console.error(error);
            return;
        }
    }
    const handleLogOut = () => [
        Swal.fire({
            title: "Are you sure to logout?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Log Out"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        Swal.fire({
                            title: "Logged Out!",
                            text: "You have been logged out successfully.",
                            icon: "success"
                        });
                    })
            }
        })
    ]
    return (
        <div>
            <title>{`Profile - Rewaz | ${userProfile?.name}`}</title>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-2xl mx-auto my-12'>
                <div className='rounded-md shadow-md p-4'>
                    <div>
                        <form onSubmit={handleImageUpload} className='flex justify-center items-center gap-2'>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className='file-input file-input-sm' />
                            <button type='submit' className='btn btn-outline btn-sm my-4'><AiOutlinePicture />Edit Photo</button>
                        </form>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-2 my-4'>
                        <div className="avatar">
                            <div className="w-50 rounded-full">
                                <img src={user?.photoURL ? user?.photoURL : userAvatar} alt="" className='max-w-[300px]' />
                            </div>
                        </div>
                        <div className='text-center space-y-1'>
                            <span className='badge badge-sm badge-neutral badge-outline uppercase'>{userProfile?.role}</span>
                            <p>{userProfile?.address}</p>
                        </div>
                        <div>
                            <button onClick={handleLogOut} className='btn btn-outline btn-error btn-sm'>Log Out</button>
                        </div>
                    </div>
                </div>
                <div className='rounded-md shadow-md p-4 space-y-2'>
                    <div className='flex justify-end'>
                        <button className='btn btn-outline' onClick={handleEdit}><AiFillEdit />Edit Profile</button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-1'>
                        <label className="label">Name</label>
                        {isLoading || <input type="text" defaultValue={userProfile?.name} {...register("name")} className='input' readOnly={!editStatus} />}
                        <label className="label">Email</label>
                        <input type="email" defaultValue={userProfile?.email} className='input text-gray-400' readOnly />
                        <label className="label">Phone</label>
                        {isLoading || <input type="tel" defaultValue={userProfile?.phone} {...register("phone")} className='input' readOnly={!editStatus} />}
                        <label className="label">Address</label>
                        {isLoading || <input type="text" defaultValue={userProfile?.address || "N/A"} {...register("address")} className='input' readOnly={!editStatus} />}
                        <button type="submit" className="btn btn-sm lg:btn-md bg-[#E97451] text-white my-4 flex items-center gap-2" disabled={!editStatus}><AiOutlineSave className="text-lg" /> Save Changes</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;