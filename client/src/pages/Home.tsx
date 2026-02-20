import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import CoverageTypes from "@/components/landing/CoverageTypes";
import HowItWorks from "@/components/landing/HowItWorks";
import StateCompliance from "@/components/landing/StateCompliance";
import VerticalsShowcase from "@/components/landing/VerticalsShowcase";
import TrustSection from "@/components/landing/TrustSection";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <CoverageTypes />
        <HowItWorks />
        <VerticalsShowcase />
        <StateCompliance />
        <TrustSection />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
