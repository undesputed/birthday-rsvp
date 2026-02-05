'use client';

import { useEffect, useState } from 'react';

export function NavigationBar() {
  const [activeSection, setActiveSection] = useState('home');
  const sections = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'details', label: 'Details', icon: '📍' },
    { id: 'gallery', label: 'Gallery', icon: '📸' },
    { id: 'rsvp', label: 'RSVP', icon: '✨' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm border-b-2 sm:border-b-4 border-secondary/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center py-2 sm:py-4 gap-1 sm:gap-2 md:gap-8 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-sm md:text-base ${
                activeSection === section.id
                  ? 'bg-accent text-foreground shadow-md scale-100 sm:scale-105'
                  : 'text-primary-foreground hover:bg-primary/80 hover:scale-100 sm:hover:scale-105'
              }`}
            >
              <span className="text-base sm:text-lg md:text-xl">{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
