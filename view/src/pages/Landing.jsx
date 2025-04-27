import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Locations from "../components/Locations";
import Navbar from "../components/Navbar";
import Popular from "../components/Popular";
import Review from "../components/Review";
import WhatWeSell from "../components/WhatWeSell";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="space-y-16 md:space-y-24">
        <Hero />
        <WhatWeSell />
        <Popular />
        <Review />
        <Locations />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;