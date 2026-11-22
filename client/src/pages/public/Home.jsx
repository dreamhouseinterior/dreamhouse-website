import Navbar from '../../components/public/Navbar.jsx'
import Hero, { Ticker } from '../../components/public/Hero.jsx'
import OwnerSegments from '../../components/public/OwnerSegments.jsx'
import Services from '../../components/public/Services.jsx'
import { Guarantees, SiteVisitBanner } from '../../components/public/Guarantees.jsx'
import RoiCalculator from '../../components/public/RoiCalculator.jsx'
import Gallery from '../../components/public/Gallery.jsx'
import ProjectMap from '../../components/public/ProjectMap.jsx'
import EstimateWizard from '../../components/public/EstimateWizard.jsx'
import { Packages, Process, Testimonials, FAQ, Footer, WhatsAppFloat } from '../../components/public/StaticSections.jsx'
import { Reveal } from '../../components/common/Reveal.jsx'

export default function Home() {
  return (
    <div className="text-slate-700">
      <Navbar />
      <Hero />
      <Ticker />
      <OwnerSegments />
      <Services />
      <Guarantees />
      <RoiCalculator />
      <Reveal><Gallery /></Reveal>
      <Reveal><ProjectMap /></Reveal>
      <Packages />
      <Process />
      <SiteVisitBanner />
      <Testimonials />
      <Reveal><EstimateWizard /></Reveal>
      <FAQ />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}