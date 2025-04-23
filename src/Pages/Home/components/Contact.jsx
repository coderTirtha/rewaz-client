import React from 'react';
import SectionTitle from '../../../Shared/SectionTitle';
import contactPhoto from '/images/contact.png';

const Contact = () => {
    return (
        <div className='my-12'>
            <SectionTitle headingColor={"Contact"} headingExtend={"Us"} />
            <div className='max-w-4xl mx-auto my-10 flex gap-6 flex-col md:flex-row items-center'>
                <div className='flex-1 flex justify-center items-center'>
                    <img src={contactPhoto} alt="" className='max-w-[350px]' />
                </div>
                <div className='flex-1'>
                    <form className='flex flex-col gap-2 w-full'>
                        <div className='flex flex-col gap-1'>
                            <label className='label'>Name</label>
                            <input className="input w-full" type="text" required placeholder="Name" />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='label'>Email</label>
                            <input className="input validator w-full" type="email" required placeholder="Email" />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='label'>Message</label>
                            <textarea className="textarea w-full" required placeholder="Message"></textarea>
                        </div>
                        <input type="submit" value="Send" className='btn btn-outline bg-[#D26B2E] border-none text-white' />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;