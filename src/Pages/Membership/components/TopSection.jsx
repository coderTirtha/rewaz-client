import bannerImage from '/images/banner.jpg';
import React from 'react';

const TopSection = () => {
    return (
        <div>
            <div
                className="hero min-h-[40svh]"
                style={{
                    backgroundImage: `url(${bannerImage})`,
                }}>
                <div className="hero-overlay bg-black/80"></div>
                <div className="hero-content text-neutral-content">
                    <div className="max-w-3xl text-center" data-aos="fade-left" data-aos-duration="1000">
                        <h1 className="mb-5 text-3xl md:text-4xl lg:text-5xl font-bold"><span className='text-[#D26B2E]'>Be a Member!</span></h1>
                        <p className="mb-5 text-justify md:text-left">
                            Join with us to be a part of our musical community!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopSection;