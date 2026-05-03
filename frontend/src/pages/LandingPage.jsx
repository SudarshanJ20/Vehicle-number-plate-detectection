// src/pages/LandingPage.jsx
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TechStrip from '../components/TechStrip'
import Features from '../components/Features'
import Demo from '../components/Demo'
import HowItWorks from '../components/HowItWorks'
import UseCases from '../components/UseCases'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#09090b] transition-colors duration-500">
      {/* If Navbar is already in App.jsx's Layout, remove it from here */}
      <Navbar /> 
      
      <main className="relative">
        {/* We use relative positioning and z-indexes to ensure sections stack correctly */}
        
        <Hero />
        
        {/* Centered TechStrip acts as a visual break between Hero and Features */}
        <TechStrip />
        
        <div className="relative z-10">
          <Features />
        </div>

        <div className="bg-white dark:bg-[#07070a] shadow-[0_-50px_100px_rgba(0,0,0,0.05)] relative z-20">
          <Demo />
        </div>

        <HowItWorks />
        
        <div className="pb-20">
           <UseCases />
        </div>
      </main>

      {/* If Footer is already in App.jsx's Layout, remove it from here */}
      <Footer />
    </div>
  )
}