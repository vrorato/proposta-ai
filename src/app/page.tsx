import { Hero } from '@/components/landing/Hero'
import { Benefits } from '@/components/landing/Benefits'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Benefits />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  )
}
