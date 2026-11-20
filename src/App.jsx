import React, { useState } from 'react';
import { VibeProvider } from './context/VibeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import ReservationSection from './components/Reservation/ReservationSection';
import Events from './components/Events';
import AtmosphereGallery from './components/AtmosphereGallery';
import ReviewsSection from './components/ReviewsSection';
import Features from './components/Features';
import LocationAccess from './components/LocationAccess';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminModal from './components/AdminDashboard/AdminModal';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedDish, setPreselectedDish] = useState(null);

  const handleSelectDishForReservation = (dish) => {
    setPreselectedDish(dish);
    // Défilement doux vers la section réservation
    const el = document.getElementById('reserve');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <VibeProvider>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500">
        {/* Navigation principale */}
        <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* Contenu principal */}
        <main>
          {/* 1. Hero plein écran */}
          <Hero />

          {/* 2. Menu avec filtres et modal ingrédients */}
          <Menu onSelectDishForReservation={handleSelectDishForReservation} />

          {/* 3. Module de Réservation haut de gamme en 3 étapes */}
          <ReservationSection preselectedDish={preselectedDish} />

          {/* 4. Événements de la semaine */}
          <Events />

          {/* 5. Galerie photos Ambiance Instagram */}
          <AtmosphereGallery />

          {/* 6. Avis clients vérifiés Google Maps */}
          <ReviewsSection />

          {/* 7. Atouts & Engagements (PMR, Ambiance, Boissons, Parking) */}
          <Features />

          {/* 8. Localisation & Horaires Google Maps */}
          <LocationAccess />
        </main>

        {/* Footer enrichi */}
        <Footer />

        {/* Navigation fixe mobile (écrans < lg) */}
        <MobileBottomNav />

        {/* Bouton flottant WhatsApp toujours disponible */}
        <FloatingWhatsApp />

        {/* Modale d'administration restaurateur protégée */}
        <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      </div>
    </VibeProvider>
  );
}
