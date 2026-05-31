import React from 'react';
import bannerImage from '/images/banner.jpg';
import logo from '/images/logo.png';
import { FaArrowRightLong } from 'react-icons/fa6';

const Banner = () => {
    return (
        <div className='page-surface'>
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: `url(${bannerImage})`,
                }}>
                <div className="hero-overlay bg-black/80"></div>
                <div className="hero-content flex flex-col items-center gap-16 text-neutral-content lg:flex-row">
                    <div data-aos="fade-right" data-aos-duration="1000" className='flex justify-center items-center'>
                        <img src={logo} alt="" className='max-w-[220px] drop-shadow-2xl lg:max-w-[350px]' />
                    </div>
                    <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-sm md:p-8" data-aos="fade-left" data-aos-duration="1000">
                        <div className='brand-chip mb-4 bg-white/10 text-white'>Since 1997</div>
                        <h1 className="mb-5 text-3xl font-bold md:text-4xl lg:text-5xl">Welcome to <span className='text-[#E97451]'>REWAZ</span></h1>
                        <p className="mb-5 text-justify md:text-left">
                            Rewaz is an extraordinary and exceptional tabla learning school, where learning meets innovation. Since 1997, Rewaz is highly committed to nourish excellence among the students by nurturing their skills, experiences with rhythm and melody!
                        </p>
                        <button className="btn brand-button">Join Now <FaArrowRightLong /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;