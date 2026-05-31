import React from 'react';

const SectionTitle = ({ headingColor, headingExtend }) => {
    return (
        <div className='mx-4 max-w-2xl py-6 md:mx-auto' data-aos="fade-up" data-aos-duration="1000">
            <div className='brand-divider mb-5' />
            <h1 className='text-center text-4xl font-bold tracking-tight text-[#1C1C1C] md:text-5xl'><span className='text-[#D26B2E]'>{headingColor}</span> {headingExtend}</h1>
        </div>
    );
};

export default SectionTitle;