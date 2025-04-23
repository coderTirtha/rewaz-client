import React from 'react';

const Footer = () => {
    return (
        <div className="bg-neutral text-neutral-content p-10">
            <footer className='footer sm:footer-horizontal'>
                <nav>
                    <h6 className="footer-title">Quick Links</h6>
                    <a className="link link-hover">Membership Policy</a>
                    <a className="link link-hover">Studentship</a>
                    <a className="link link-hover">Donation</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Shortcuts</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                </nav>
            </footer>
            <p className='text-center my-4'>Copyright © {new Date().getFullYear()} - All right reserved by REWAZ</p>
        </div>
    );
};

export default Footer;