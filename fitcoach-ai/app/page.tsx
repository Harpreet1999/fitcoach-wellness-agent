import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import CapabilitiesGrid from '@/components/sections/CapabilitiesGrid';
import ArchitectureSection from '@/components/sections/ArchitectureSection';
import DemoSection from '@/components/sections/DemoSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-neutral-800 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-950 font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CapabilitiesGrid />
        <DemoSection />
        <ArchitectureSection />
      </main>
      <Footer />
    </div>
  );
}
