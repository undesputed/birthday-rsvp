'use client';

import { HeroSection } from '@/components/hero-section';
import { EventDetails } from '@/components/event-details';
import { PhotoGallery } from '@/components/photo-gallery';
import { RSVPForm } from '@/components/rsvp-form';
import { NavigationBar } from '@/components/navigation-bar';

export default function Home() {
  return (
    <>
      <NavigationBar />
      <main className="w-full">
        <div id="home">
          <HeroSection />
        </div>
        <div id="details">
          <EventDetails />
        </div>
        <div id="gallery">
          <PhotoGallery />
        </div>
        <div id="rsvp">
          <RSVPForm />
        </div>
      </main>
    </>
  );
}
