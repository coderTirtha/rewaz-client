import React from 'react';
import Banner from './components/Banner';
import About from './components/About';
import Contact from './components/Contact';
import Quote from './components/Quote';

const Home = () => {
    return (
        <div>
            <title>Home | Rewaz</title>
            <Banner />
            <About />
            <Quote />
            <Contact />
        </div>
    );
};

export default Home;