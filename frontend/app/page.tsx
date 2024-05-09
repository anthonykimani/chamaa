"use client";

import React from 'react'
import About from '@/components/landing-page/About';
import Features from '@/components/landing-page/Features';
import HeroSection from '@/components/landing-page/HeroSection';
import Navbar from '@/components/landing-page/Navbar';
import RoadMap from '@/components/landing-page/RoadMap';
import Team from '@/components/landing-page/Team';
import Footer from '@/components/landing-page/Footer';

const Home = () => {
  return (
    <section className='bg-white text-black font-lexend'>
        <Navbar />
        <HeroSection />
        <About />
        <Features />
        <RoadMap />
        <Team />
        <Footer />
    </section>
  )
}

export default Home