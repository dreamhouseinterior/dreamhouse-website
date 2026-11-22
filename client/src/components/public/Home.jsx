import Navbar from '../../components/public/Navbar.jsx'
import Hero from '../../components/public/Hero.jsx'
import OwnerSegments from '../../components/public/OwnerSegments.jsx'
import { Guarantees, SiteVisitBanner } from '../../components/public/Guarantees.jsx'
import RoiCalculator from '../../components/public/RoiCalculator.jsx'
import Gallery from '../../components/public/Gallery.jsx'
import ProjectMap from '../../components/public/ProjectMap.jsx'
import EstimateWizard from '../../components/public/EstimateWizard.jsx'
import { Packages, Process, Testimonials, FAQ, Footer, WhatsAppFloat } from '../../components/public/StaticSections.jsx'

export default function Home() {
  return (
    <div className="scroll-smooth text-slate-700">
      <Navbar />
      <Hero />
      <OwnerSegments />
      <Guarantees />
      <RoiCalculator />
      <Gallery />
      <ProjectMap />
      <Packages />
      <Process />
      <SiteVisitBanner />
      <Testimonials />
      <EstimateWizard />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}