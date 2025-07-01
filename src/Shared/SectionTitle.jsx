import React from 'react';

const SectionTitle = ({ headingColor, headingExtend }) => {
    return (
        <div className='max-w-xl mx-4 lg:max-w-4xl lg:mx-auto py-6 border-b-[#1C1C1C] border-b-2' data-aos="fade-up" data-aos-duration="1000">
            <h1 className='text-5xl text-center font-bold'><span className='text-[#D26B2E]'>{headingColor}</span> {headingExtend}</h1>
        </div>
    );
};

export default SectionTitle;