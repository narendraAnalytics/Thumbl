import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { PricingSection } from "@/components/PricingSection"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { PromoModalWrapper } from "@/components/PromoModalWrapper"

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
      <Footer />

      {/* Promotional Video Modal */}
      <PromoModalWrapper />
    </main>
  )
}
