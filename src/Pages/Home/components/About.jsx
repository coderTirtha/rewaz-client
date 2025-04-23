import React from 'react';
import SectionTitle from '../../../Shared/SectionTitle';
import instructorPhoto from '/images/sir.png';
import { MdOutlinePhone } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { CiLocationOn } from 'react-icons/ci';
import { IoMdOpen } from 'react-icons/io';

const About = () => {
    return (
        <div className='my-12'>
            <SectionTitle headingColor={"About"} headingExtend={"Us"} />
            <div className='flex flex-col gap-4 md:flex-row max-w-4xl mx-auto my-6 hover:shadow-lg p-6 rounded'>
                <div className='flex-1 flex flex-col justify-center items-center' data-aos="fade-right" data-aos-duration="1000">
                    <img src={instructorPhoto} alt="" className='rounded-bl-3xl rounded-tr-3xl max-w-[350px]' />
                    <div className='my-2 text-center'>
                        <h1 className='font-semibold text-xl'>Pandit Sudip Sen Gupta</h1>
                        <h5 className='text-[#E97451]'>Instructor & Founder</h5>
                    </div>
                </div>
                <div className='flex-1' data-aos="fade-left" data-aos-duration="1000">
                    <div>
                        <p className='text-justify'><span className='text-[#E97451] text-2xl'>REWAZ</span> is an institution where the rhythm of tradition meets the beat of innovation. Founded by Pandit Sudip Sen Gupta on January 1st, 1997, Rewaz is more than just a tabla learning school—it's a cultural cornerstone in the heart of Chittagong. Nestled at 68/C Rahmatgonj By Lane, Rahmatgonj, our school is a sanctuary for aspiring tabla players, offering expert instruction and a nurturing environment for students to hone their craft.</p>
                        <div className='my-4'>
                            <h4 className='font-bold text-lg flex gap-2 items-center'><MdOutlinePhone className='text-xl' /> Contact</h4>
                            <p className='text-gray-600'><Link to={'tel:+8801819-633123'} className='hover:underline'>+8801819-633123</Link></p>
                        </div>
                        <div className='my-4'>
                            <h4 className='font-bold text-lg flex gap-2 items-center'><CiLocationOn className='text-xl' /> Location</h4>
                            <p className='text-gray-600'>3 Rahmatgonj By Lane, Rahmatgonj, Chittagong</p>
                        </div>
                        <Link target='_blank' to={'https://www.google.com/maps/place/Sayeds+place/@22.3443733,91.8372844,3a,75y,40.82h,61.97t/data=!3m7!1e1!3m5!1sZcvAdl6He8sJEm5lOoJqeg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D28.032292109268127%26panoid%3DZcvAdl6He8sJEm5lOoJqeg%26yaw%3D40.81884375531207!7i13312!8i6656!4m9!1m2!2m1!1s3+Rahmatgonj+By+Lane,+Rahmatgonj,+Chittagong!3m5!1s0x30ad27001fbf891f:0xa3d30c919ae85b66!8m2!3d22.3443632!4d91.8373594!16s%2Fg%2F11ltvmj2ds?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D'}><button className='btn bg-[#D26B2E] border-none text-white'>View location in Map <IoMdOpen className="text-xl" /></button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;