import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import CapabilitiesGrid from '@/components/sections/CapabilitiesGrid';
import ArchitectureSection from '@/components/sections/ArchitectureSection';
import DemoSection from '@/components/sections/DemoSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CapabilitiesGrid />
        <ArchitectureSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}
