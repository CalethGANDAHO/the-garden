import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppFallbackLink } from '../lib/reservationService';

export default function FloatingWhatsApp() {
  const whatsappUrl = generateWhatsAppFallbackLink();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Réserver ou discuter sur WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_25px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 active:scale-95 lg:bottom-8 lg:right-8 group"
    >
      {/* Onde pulsée radar */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35" />
      
      {/* Icône principale */}
      <MessageCircle className="relative z-10 size-7 fill-white text-transparent group-hover:scale-105 transition-transform" />

      {/* Info-bulle desktop au survol */}
      <span className="absolute right-16 hidden rounded-xl bg-black/90 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap shadow-xl lg:group-hover:block backdrop-blur-md">
        Réserver par WhatsApp 💬
      </span>
    </a>
  );
}
