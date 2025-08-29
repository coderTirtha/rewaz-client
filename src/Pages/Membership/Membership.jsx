import React, { useState } from 'react';
import TopSection from './components/TopSection';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { MdFileUpload } from 'react-icons/md';

const Membership = () => {
    const [photoUrl, setPhotoUrl] = useState("");
    const [disableStatus, setDisableStatus] = useState(false);
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: databaseUser } = useQuery({
        enabled: !!user,
        queryKey: ['user'],
        queryFn: async () => {
            const result = await axiosSecure.get(`/user/${user?.uid}`, { withCredentials: true });
            return result?.data;
        }
    });
    const { register, handleSubmit, reset } = useForm();

    const handleImageUpload = () => {
        if (!window.cloudinary) {
            toast.error("Cloudinary widget is not loaded!");
            return;
        }

        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, // ⬅️ Replace with actual cloud name
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // ⬅️ Replace with unsigned preset
                sources: ['local', 'url', 'camera'],
                multiple: false,
                resourceType: 'image',
                cropping: false,
                folder: "rewaz-members"
            },
            (error, result) => {
                if (!error && result.event === 'success') {
                    const uploadedUrl = result.info.secure_url;
                    setPhotoUrl(uploadedUrl);
                    toast.success("Photo uploaded!");
                } else if (error) {
                    console.error(error);
                    toast.error("Upload failed!");
                }
            }
        );
    }

    const onSubmit = async (data) => {
        setDisableStatus(true);
        if (photoUrl) {
            try {
                    const newMember = {
                        name: data?.firstName + " " + data?.lastName,
                        email: data?.email,
                        phone: databaseUser?.phone,
                        identificationMethod: data?.identificationMethod,
                        identificationNumber: data?.identificationNumber,
                        dateOfBirth: data?.dateOfBirth,
                        occupation: data?.occupation,
                        nationality: data?.nationality,
                        photo: photoUrl,
                        membershipStatus: "pending"
                    }
                    const response = await axiosSecure.post('/members', newMember, { withCredentials: true });
                    // console.log(response);
                    if (response?.data?.insertedId) {
                        toast.success('Congratulations for filling up the membership form successfully! You will receive a mail/phone call after the approval of our authority within 24 hours!', {
                            autoClose: 5000,
                        });
                        reset();
                        setDisableStatus(false);
                    }
                }
            catch {

            }
        }
    }
    return (
        <div>
            <TopSection />
            <div className='mx-4 max-w-3xl lg:mx-auto rounded-lg shadow-lg my-12 p-6'>
                <div>
                    <h1 className='text-3xl font-bold text-center'>Membership Form</h1>
                </div>
                <form className='my-6' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='fieldset flex-1 w-full'>
                            <label className='label'>First Name <span className='font-bangla'>(নামের প্রথম অংশ)</span></label>
                            <input {...register('firstName', { required: true })} type="text" className='input w-full' placeholder='First Name' required disabled={disableStatus} />
                        </div>
                        <div className='fieldset flex-1 w-full'>
                            <label className='label'>Last Name/Surname <span className='font-bangla'>(নামের শেষ অংশ)</span></label>
                            <input {...register('lastName', { required: true })} type="text" className='input w-full' placeholder='Last Name/Surname' required disabled={disableStatus} />
                        </div>
                    </div>
                    <div className='fieldset w-full'>
                        <label className="label">Email <span className='font-bangla'>(ইমেইল)</span></label>
                        <input {...register('email')} type="email" className='input w-full text-gray-400' value={user?.email} readOnly />
                        <h6 className='text-xs text-gray-500 italic'>** Email can't be changed! <span className='font-bangla'>(ইমেইল পরিবর্তনযোগ্য নয়!)</span></h6>
                    </div>
                    <div className='fieldset w-full'>
                        <label className="label">Phone</label>
                        <input {...register('phone')} type="text" className='input w-full text-gray-400' value={databaseUser?.phone} readOnly />
                        <h6 className='text-xs text-gray-500 italic'>** Contact Number can't be changed! <span className='font-bangla'>(ফোন নম্বর পরিবর্তনযোগ্য নয়!)</span></h6>
                    </div>
                    <div className='fieldset w-full'>
                        <label className="label">NID / Birth Registration No. <span className='font-bangla'>(জাতীয় পরিচয়পত্র / জন্মসনদ নং.)</span></label>
                        <div className='flex gap-2'>
                            <select {...register('identificationMethod')} className="select flex-1/4" disabled={disableStatus}>
                                <option>NID</option>
                                <option>Birth Registration</option>
                            </select>
                            <input {...register('identificationNumber')} type="text" className='input w-full' placeholder='Enter your NID / Birth Registration no.' required disabled={disableStatus} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className='fieldset w-full'>
                            <label className="label">Date of Birth <span className='font-bangla'>(জন্ম তারিখ)</span></label>
                            <input {...register('dateOfBirth')} type="date" className='input w-full' />
                        </div>
                        <div className='fieldset w-full'>
                            <label className="label">Occupation <span className='font-bangla'>(পেশা)</span></label>
                            <select {...register('occupation')} defaultValue="আপনার পেশা নির্বাচন করুন" className="select font-bangla w-full" required disabled={disableStatus}>
                                <option disabled>আপনার পেশা নির্বাচন করুন</option>
                                <option>ডাক্তার</option>
                                <option>ছাত্র / ছাত্রী</option>
                                <option>ইঞ্জিনিয়ার</option>
                                <option>ব্যাংকার</option>
                                <option>ব্যবসায়ী</option>
                                <option>চাকুরিজীবি</option>
                                <option>কৃষক</option>
                                <option>ক্ষুদ্র ব্যবসায়ী</option>
                                <option>স্বনির্ভর</option>
                                <option>শিল্পী</option>
                                <option>অন্যান্য</option>
                            </select>
                        </div>
                        <div className='fieldset w-full'>
                            <label className="label">Nationality <span className='font-bangla'>(জাতীয়তা)</span></label>
                            <input {...register('nationality', { required: true })} type="text" className='input w-full' placeholder='Nationality' required disabled={disableStatus} />
                        </div>
                    </div>
                    <div className="fieldset w-full">
                        <label className="label">Choose a Picture <span className='font-bangla'>(একটি ছবি নির্বাচন করুন)</span></label>
                        <button type='button' onClick={handleImageUpload} className='btn btn-outline'><MdFileUpload /> Upload Photo</button>
                        <h6 className='text-xs text-gray-500 italic'>** Max file size ~ 5 MB! <span className='font-bangla'>(সর্বোচ্চ ফাইল সাইজ ~ ৫ মেগাবাইট)</span></h6>
                    </div>
                    <button type='submit' className="btn border-0 shadow-none w-full bg-[#E97451] text-white my-3" disabled={disableStatus}>Submit</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Membership;