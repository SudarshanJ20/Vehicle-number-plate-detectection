import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TechStrip from './components/TechStrip'
import Features from './components/Features'
import Demo from './components/Demo'
import HowItWorks from './components/HowItWorks'
import UseCases from './components/UseCases'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechStrip />
        <Features />
        <Demo />
        <HowItWorks />
        <UseCases />
      </main>
      <Footer />
    </>
  )
}