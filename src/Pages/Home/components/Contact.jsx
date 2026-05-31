import React from 'react';
import SectionTitle from '../../../Shared/SectionTitle';
import contactPhoto from '/images/contact.png';

const Contact = () => {
    return (
        <div className='section-shell'>
            <SectionTitle headingColor={"Contact"} headingExtend={"Us"} />
            <div className='surface-card mx-auto my-10 flex max-w-5xl flex-col items-center gap-6 p-6 md:flex-row'>
                <div className='flex-1 flex justify-center items-center' data-aos="fade-right" data-aos-duration="1000">
                    <img src={contactPhoto} alt="" className='max-w-[250px] lg:max-w-[350px]' />
                </div>
                <div className='md:flex-1 md:max-w-xl' data-aos="fade-left" data-aos-duration="1000">
                    <form className='flex w-full flex-col gap-3'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='label'>Name</label>
                            <input className="input soft-input w-full" type="text" required placeholder="Name" />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='label'>Email</label>
                            <input className="input validator soft-input w-full" type="email" required placeholder="Email" />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='label'>Message</label>
                            <textarea className="textarea soft-textarea w-full" required placeholder="Message"></textarea>
                        </div>
                        <input type="submit" value="Send" className='btn border-none bg-[#D26B2E] text-white shadow-lg shadow-[#D26B2E]/20' />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;