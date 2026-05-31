import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="border-t border-stone-200 bg-gradient-to-b from-white to-[#fff7f3] px-6 py-10 text-stone-700">
            <footer className='footer mx-auto max-w-7xl sm:footer-horizontal'>
                <nav>
                    <h6 className="footer-title text-[#1C1C1C]">Quick Links</h6>
                    <Link className='hover:underline' to={'/membership-policy'}>Membership Policy</Link>
                    <Link className='hover:underline' to={'/studentship-policy'}>Studentship Policy</Link>
                    <Link className='hover:underline' to={'/donate'}>Donation</Link>
                </nav>
                <nav>
                    <h6 className="footer-title text-[#1C1C1C]">Shortcuts</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                </nav>
                <nav>
                    <h6 className="footer-title text-[#1C1C1C]">Legal</h6>
                    <Link className='hover:underline' to={'/terms-and-conditions'}>Terms & Conditions</Link>
                    <a className="link link-hover">Privacy Policy</a>
                </nav>
            </footer>
            <p className='mx-auto mt-6 max-w-7xl text-center text-sm text-stone-500'>Copyright © {new Date().getFullYear()} - All right reserved by REWAZ</p>
        </div>
    );
};

export default Footer;