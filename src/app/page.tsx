import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Hero from '@/components/vitrine/Hero';
import Features from '@/components/vitrine/Features';
import ROISection from '@/components/vitrine/ROISection';
import Pricing from '@/components/vitrine/Pricing';
import DemoForm from '@/components/vitrine/DemoForm';
import Footer from '@/components/vitrine/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">FastGross Pro</span>
            <span className="text-sm text-gray-500 hidden sm:inline">× DISTRAM</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#fonctionnalites" className="text-gray-600 hover:text-gray-900 transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tarifs
            </a>
            <a href="#roi" className="text-gray-600 hover:text-gray-900 transition-colors">
              ROI
            </a>
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <a href="#demo">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Demander une démo
              </Button>
            </a>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Stats DISTRAM */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-orange-600">487</p>
              <p className="text-gray-600">Clients actifs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600">892K€</p>
              <p className="text-gray-600">CA mensuel</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600">3</p>
              <p className="text-gray-600">Dépôts</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600">30s</p>
              <p className="text-gray-600">Pour créer un devis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - 6 IAs */}
      <Features />

      {/* ROI Calculator */}
      <ROISection />

      {/* Pricing */}
      <Pricing />

      {/* Demo Form */}
      <DemoForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}
