// src/pages/LandingPage.tsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ValuePillars from '../components/ValuePillars';
import FeatureSections from '../components/FeatureSections';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import NewsAndNoteworthy from '../components/NewsAndNoteworthy';
import BetaCTA from '../components/BetaCTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <ValuePillars />
      <FeatureSections />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <NewsAndNoteworthy />
      <BetaCTA />
      <Footer />
    </>
  );
};

export default LandingPage;