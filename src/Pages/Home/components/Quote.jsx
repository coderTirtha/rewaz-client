import React from 'react';
import quoteBg from '/images/quote-bg.jpg';
import zakirHussain from '/images/zakir hussain.jpg';
import { BiSolidQuoteLeft } from 'react-icons/bi';

const Quote = () => {
    return (
        <div style={{ backgroundImage: `url(${quoteBg})` }} className='bg-cover bg-center bg-no-repeat py-12 bg-blend-overlay'>
            <div className='mx-auto flex max-w-5xl flex-col-reverse items-center gap-6 px-4 md:flex-row'>
                <div className='flex-1' data-aos="fade-right" data-aos-duration="1000">
                    <img src={zakirHussain} alt="" className='h-[300px] max-w-[300px] object-cover shadow-2xl lg:h-[500px] lg:max-w-[500px] rounded-tl-4xl rounded-br-4xl' />
                </div>
                <div className='flex-1 rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-sm' data-aos="fade-zoom-in"
                    data-aos-easing="ease-in-back"
                    data-aos-delay="300"
                    data-aos-offset="0" data-aos-duration="1000">
                    <BiSolidQuoteLeft className='text-[8rem] text-white' />
                    <div className='p-6 border-b-2 border-white'>
                        <p className='text-white italic'>To me, rhythm also tells a story, and so when I’m with the rhythm, I’m constantly thinking about how it’s going to go.</p>
                    </div>
                    <h5 className='text-right text-white font-semibold my-4'>- Ustad Zakir Hussain</h5>
                </div>
            </div>
        </div>
    );
};

export default Quote;