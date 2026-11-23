import React from 'react';
import { Utensils, Calendar, Music, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const { t } = useLanguage();

  const items = [
    { href: '#menu', label: t.nav.menu, icon: Utensils },
    { href: '#reserve', label: t.nav.reserve, icon: Calendar },
    { href: '#events', label: t.nav.events, icon: Music },
    { href: 'tel:+22990005656', label: t.location.phoneLabel || 'Appeler', icon: Phone },
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <ul className="glass grid grid-cols-4 rounded-2xl border border-white/15 bg-black/85 p-1.5 shadow-2xl backdrop-blur-xl">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <a
              href={href}
              className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-primary active:scale-95"
            >
              <Icon className="size-4 text-primary" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
