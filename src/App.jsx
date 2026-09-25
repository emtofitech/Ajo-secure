import "./styles/index.css";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import { StatBand, Features, TrustSafety, Fees, CTA, Footer } from "./components/Sections.jsx";

export default function App() {
  return (
    <>
      <a
        href="#how"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>

      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <StatBand />
        <Features />
        <TrustSafety />
        <Fees />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
