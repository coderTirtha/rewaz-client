import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdFileUpload } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AddStudent = () => {
    const { register, handleSubmit, reset } = useForm();
    const [photoUrl, setPhotoUrl] = useState("");
    const [disableStatus, setDisableStatus] = useState(false);
    const axiosSecure = useAxiosSecure();
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
                folder: "rewaz-students"
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
                const newStudent = {
                    formNumber: data?.formNumber,
                    studentNameBangla: data?.studentNameBangla,
                    studentNameEnglish: data?.studentNameEnglish,
                    fatherName: data?.fatherName,
                    fatherOccupation: data?.fatherOccupation,
                    motherName: data?.motherName,
                    motherOccupation: data?.motherOccupation,
                    permanentAddress: {
                        village: data?.village,
                        postOffice: data?.postOffice,
                        thana: data?.thana,
                        district: data?.district
                    },
                    presentAddress: data?.presentAddress,
                    dateOfBirth: data?.dateOfBirth,
                    studentOccupation: data?.studentOccupation,
                    mobileNo: data?.mobileNo,
                    currentInstitution: data?.currentInstitution,
                    educationalQualification: data?.educationalQualification,
                    previousTrainer: data?.previousTrainer,
                    photo: photoUrl
                };
                const response = await axiosSecure.post('/students', newStudent, { withCredentials: true });

                if(response?.data?.insertedId){
                    toast.success("Student added successfully!", {
                        autoClose: 2000,
                    });
                    reset();
                    setPhotoUrl("");
                    setDisableStatus(false);
                }
            } catch (error) {
                toast.error(error?.message);
            }
        }
    }
    return (
        <div className='w-full'>
            <div className='flex justify-center items-center'>
                <div className='max-w-xs bg-neutral px-6 py-3 rounded-full my-8'>
                    <h1 className='text-white'><span className='font-bangla'>ভর্তির আবেদনপত্র</span> <span className='text-gray-400'>(Admission Form)</span></h1>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='mx-4 md:mx-10 mb-12'>
                <div className='flex justify-end'>
                    <div className='fieldset'>
                        <label className='label'>Form No. <span className='font-bangla'>(ফর্ম নং)</span></label>
                        <input {...register('formNumber', { required: true })} type="number" className='input w-full' placeholder="Form No." required />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='fieldset w-full'>
                        <label className='label'>Student's Name - Bangla <span className='font-bangla'>(শিক্ষার্থীর নাম : বাংলায়)</span></label>
                        <input {...register('studentNameBangla', { required: true })} type="text" className='input w-full font-bangla' placeholder="Student's Name - Bangla" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>Student's Name - English <span className='font-bangla'>(শিক্ষার্থীর নাম : ইংরেজিতে)</span></label>
                        <input {...register('studentNameEnglish', { required: true })} type="text" className='input w-full' placeholder="Student's Name - English" required />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='fieldset w-full'>
                        <label className='label'>Father's Name<span className='font-bangla'>(পিতার নাম)</span></label>
                        <input {...register('fatherName', { required: true })} type="text" className='input w-full' placeholder="Father's Name" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>Occupation<span className='font-bangla'>(পেশা)</span></label>
                        <select {...register('fatherOccupation')} defaultValue="পিতার পেশা নির্বাচন করুন" className="select font-bangla w-full" required disabled={disableStatus}>
                            <option disabled>পিতার পেশা নির্বাচন করুন</option>
                            <option>ডাক্তার</option>
                            <option>ছাত্র / ছাত্রী</option>
                            <option>ইঞ্জিনিয়ার</option>
                            <option>গৃহিণী</option>
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
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='fieldset w-full'>
                        <label className='label'>Mother's Name<span className='font-bangla'>(মাতার নাম)</span></label>
                        <input {...register('motherName', { required: true })} type="text" className='input w-full' placeholder="Mother's Name" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>Occupation<span className='font-bangla'>(পেশা)</span></label>
                        <select {...register('motherOccupation')} defaultValue="মাতার পেশা নির্বাচন করুন" className="select font-bangla w-full" required disabled={disableStatus}>
                            <option disabled>মাতার পেশা নির্বাচন করুন</option>
                            <option>ডাক্তার</option>
                            <option>ছাত্র / ছাত্রী</option>
                            <option>ইঞ্জিনিয়ার</option>
                            <option>গৃহিণী</option>
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
                </div>
                <label className='label'>Permanent Address <span className='font-bangla'>(স্থায়ী ঠিকানা)</span></label>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='fieldset w-full'>
                        <label className='label'>Village <span className='font-bangla'>(গ্রাম)</span></label>
                        <input {...register('village', { required: true })} type="text" className='input w-full' placeholder="Village Name" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>Post Office <span className='font-bangla'>(ডাকঘর)</span></label>
                        <input {...register('postOffice', { required: true })} type="text" className='input w-full' placeholder="Post Office" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>Thana/Upazilla <span className='font-bangla'>(থানা/উপজেলা)</span></label>
                        <input {...register('thana', { required: true })} type="text" className='input w-full' placeholder="Thana/Upazilla" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>District <span className='font-bangla'>(জেলা)</span></label>
                        <input {...register('district', { required: true })} type="text" className='input w-full' placeholder="District" required />
                    </div>
                </div>
                <div className='fieldset w-full'>
                    <label className='label'>Present Address <span className='font-bangla'>(বর্তমান ঠিকানা)</span></label>
                    <input {...register('presentAddress', { required: true })} type="text" className='input w-full' placeholder="Present Address" required />
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='fieldset w-full'>
                        <label className='label'>Date of Birth <span className='font-bangla'>(জন্ম তারিখ)</span></label>
                        <input {...register('dateOfBirth', { required: true })} type="date" className='input w-full' placeholder="Date of Birth" required />
                    </div>
                    <div className='fieldset w-full'>
                        <label className='label'>Occupation <span className='font-bangla'>(পেশা)</span></label>
                        <select {...register('studentOccupation')} defaultValue="আপনার পেশা নির্বাচন করুন" className="select font-bangla w-full" required disabled={disableStatus}>
                            <option disabled>আপনার পেশা নির্বাচন করুন</option>
                            <option>ডাক্তার</option>
                            <option>ছাত্র / ছাত্রী</option>
                            <option>ইঞ্জিনিয়ার</option>
                            <option>গৃহিণী</option>
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
                        <label className='label'>Mobile No. <span className='font-bangla'>(মোবাইল নম্বর)</span></label>
                        <input {...register('mobileNo', { required: true })} type="text" className='input w-full' placeholder="Mobile No." required />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='fieldset w-full'>
                        <label className='label'>Current Educational Institution<span className='font-bangla'>(অধ্যয়নরত শিক্ষা প্রতিষ্ঠানের নাম)</span></label>
                        <input {...register('currentInstitution', { required: true })} type="text" className='input w-full' placeholder="Current Educational Institution" required />
                    </div>
                    <div className='fieldset flex-1 w-full'>
                        <label className='label'>Educational Qualification <span className='font-bangla'>(অধ্যয়নরত শ্রেণি / শিক্ষাগত যোগ্যতা)</span></label>
                        <select {...register('educationalQualification')} defaultValue="আপনার শ্রেণি / শিক্ষাগত যোগ্যতা নির্বাচন করুন" className="select font-bangla w-full" required>
                            <option disabled>আপনার শ্রেণি / শিক্ষাগত যোগ্যতা নির্বাচন করুন</option>
                            <option>প্লে-গ্রুপ</option>
                            <option>নার্সারী</option>
                            <option>কেজি</option>
                            <option>প্রথম শ্রেণি</option>
                            <option>দ্বিতীয় শ্রেণি</option>
                            <option>তৃতীয় শ্রেণি</option>
                            <option>চতুর্থ শ্রেণি</option>
                            <option>পঞ্চম শ্রেণি</option>
                            <option>ষষ্ঠ শ্রেণি</option>
                            <option>সপ্তম শ্রেণি</option>
                            <option>অষ্টম শ্রেণি</option>
                            <option>নবম শ্রেণি</option>
                            <option>দশম শ্রেণি</option>
                            <option>একাদশ শ্রেণি</option>
                            <option>দ্বাদশ শ্রেণি</option>
                            <option>বি.এসসি / বি.কম / বি.এ</option>
                            <option>এম.এসসি / এম.কম / এম.এ</option>
                        </select>
                    </div>
                </div>
                <div className='fieldset w-full'>
                    <label className='label'>Previous Trainer Name <span className='font-bangla'>(পূর্বে প্রশিক্ষণপ্রাপ্ত শিক্ষকের নাম)</span></label>
                    <input {...register('previousTrainer', { required: true })} type="text" className='input w-full' placeholder="Previous Trainer Name" required />
                </div>
                <div className="fieldset w-full">
                    <label className="label">Add Picture <span className='font-bangla'>(শিক্ষার্থীর ছবি সংযুক্ত করুন)</span></label>
                    <button type='button' onClick={handleImageUpload} className='btn btn-outline'><MdFileUpload /> Upload Photo</button>
                    <h6 className='text-xs text-gray-500 italic'>** Max file size ~ 5 MB! <span className='font-bangla'>(সর্বোচ্চ ফাইল সাইজ ~ ৫ মেগাবাইট)</span></h6>
                </div>
                <button type='submit' className="btn border-0 shadow-none w-full bg-[#E97451] text-white my-3">Add Student</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddStudent;