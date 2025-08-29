import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-neutral text-neutral-content p-10">
            <footer className='footer sm:footer-horizontal'>
                <nav>
                    <h6 className="footer-title">Quick Links</h6>
                    <Link className='hover:underline' to={'/membership-policy'}>Membership Policy</Link>
                    <Link className='hover:underline' to={'/studentship-policy'}>Studentship Policy</Link>
                    <Link className='hover:underline' to={'/donate'}>Donation</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Shortcuts</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <Link className='hover:underline' to={'/terms-and-conditions'}>Terms & Conditions</Link>
                    <a className="link link-hover">Privacy Policy</a>
                </nav>
            </footer>
            <p className='text-center my-4'>Copyright © {new Date().getFullYear()} - All right reserved by REWAZ</p>
        </div>
    );
};

export default Footer;