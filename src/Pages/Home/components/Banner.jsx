import React from 'react';
import bannerImage from '/images/banner.jpg';
import logo from '/images/logo.png';
import { FaArrowRightLong } from 'react-icons/fa6';

const Banner = () => {
    return (
        <div>
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: `url(${bannerImage})`,
                }}>
                <div className="hero-overlay bg-black/80"></div>
                <div className="hero-content text-neutral-content flex flex-col lg:flex-row items-center gap-20">
                    <div data-aos="fade-right" data-aos-duration="1000" className='flex justify-center items-center'>
                        <img src={logo} alt="" className='max-w-[220px] lg:max-w-[350px]' />
                    </div>
                    <div className="max-w-3xl" data-aos="fade-left" data-aos-duration="1000">
                        <h1 className="mb-5 text-3xl md:text-4xl lg:text-5xl font-bold">Welcome to <span className='text-[#D26B2E]'>REWAZ</span></h1>
                        <p className="mb-5 text-justify md:text-left">
                            Rewaz is an extraordinary and exceptional tabla learning school, where learning meets innovation. Since 1997, Rewaz is highly committed to nourish excellence among the students by nurturing their skills, experiences with rhythm and melody!
                        </p>
                        <button className="btn bg-[#E97451] text-white border-none shadow-[#E97451]">Join Now <FaArrowRightLong /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;