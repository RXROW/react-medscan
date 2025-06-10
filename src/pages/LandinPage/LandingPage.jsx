import React from "react";
import Navbar from "../../components/Nav/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./Hero/HeroSection";
import HowToUse from "./HowTo/HowToUse";
import WhoItsFor from "./Who/WhoItsFor";
import StatsSection from "./Stats/StatsSection";
import SymptomsSection from "./Symptoms/SymptompsSection";
import ArticlesSection from "./Article/ArticleSection";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowToUse />
      <WhoItsFor />
      <StatsSection />
      <SymptomsSection />
      <ArticlesSection />
      <Footer />
    </>
  );
};

export default LandingPage;
