'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { sendRSVPNotification } from '@/lib/emailjs';

const RSVP_DEADLINE = new Date('2026-02-11T23:59:59');

export function RSVPForm() {
  const isPastDeadline = new Date() > RSVP_DEADLINE;

  const [formData, setFormData] = useState({
    guestName: '',
    attending: 'yes',
    numberOfGuests: 0,
    additionalGuests: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'numberOfGuests' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.guestName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (isPastDeadline) {
      setError('The RSVP deadline has passed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.guestName,
          attending: formData.attending,
          numberOfGuests: formData.numberOfGuests,
          additionalGuests: formData.additionalGuests,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save RSVP');
      }

      await sendRSVPNotification({
        guestName: formData.guestName,
        attending: formData.attending,
        numberOfGuests: formData.numberOfGuests,
        additionalGuests: formData.additionalGuests,
      });

      setSubmitted(true);
      setFormData({
        guestName: '',
        attending: 'yes',
        numberOfGuests: 0,
        additionalGuests: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to submit RSVP or send notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-br from-primary/5 via-secondary/30 to-accent/10 relative">
      {/* Decorative elements - hidden on small screens */}
      <div className="hidden sm:block absolute top-10 right-10 text-5xl sm:text-6xl opacity-20 animate-pulse">🎈</div>
      <div className="hidden sm:block absolute bottom-10 left-10 text-4xl sm:text-5xl opacity-15">🎉</div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-2">
          RSVP Now
        </h2>
        <p className="text-center text-foreground/70 mb-2 sm:mb-3 text-sm sm:text-lg">
          Let us know if you can make it to the celebration!
        </p>
        <p className="text-center text-foreground/80 font-semibold mb-2 text-sm sm:text-base">
          Please RSVP before February 12.
        </p>
        <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 text-2xl sm:text-3xl">
          🐻 ✨ 🎈
        </div>

        {submitted && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100/80 backdrop-blur-sm border-2 border-green-400 text-green-800 rounded-lg sm:rounded-xl font-semibold text-center text-sm sm:text-base">
            Thank you for your RSVP! We can't wait to see you!
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100/80 backdrop-blur-sm border-2 border-red-400 text-red-800 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base">
            {error}
          </div>
        )}

        {isPastDeadline && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-100/90 backdrop-blur-sm border-2 border-amber-500 text-amber-900 rounded-lg sm:rounded-xl font-semibold text-center text-sm sm:text-base">
            The RSVP deadline (February 11) has passed. Thank you to everyone who responded!
          </div>
        )}

        <Card className={`p-4 sm:p-8 border-2 sm:border-3 border-primary/30 bg-white/70 backdrop-blur-sm shadow-xl rounded-lg sm:rounded-2xl ${isPastDeadline ? 'opacity-75' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-primary/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-medium text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-2 sm:mb-3">
                Will you be attending? *
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {[
                  { value: 'yes', label: 'Yes, I will attend', emoji: '✅' },
                  { value: 'no', label: 'No, I cannot attend', emoji: '❌' },
                  { value: 'maybe', label: 'Maybe', emoji: '❓' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-primary/10 transition-colors">
                    <input
                      type="radio"
                      name="attending"
                      value={option.value}
                      checked={formData.attending === option.value}
                      onChange={handleChange}
                      className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer accent-primary"
                    />
                    <span className="text-foreground font-medium text-xs sm:text-base">
                      {option.emoji} <span className="hidden sm:inline">{option.label}</span><span className="sm:hidden">{option.emoji}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {formData.attending === 'yes' && (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-foreground mb-2">
                    How many additional guests will you bring?
                  </label>
                  <select
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-primary/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-medium text-sm sm:text-base"
                  >
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.numberOfGuests > 0 && (
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-foreground mb-2">
                      Names of additional guests
                    </label>
                    <textarea
                      name="additionalGuests"
                      value={formData.additionalGuests}
                      onChange={handleChange}
                      placeholder="Enter names of your guests (one per line)"
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-primary/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-medium text-sm sm:text-base"
                    />
                  </div>
                )}
              </>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isPastDeadline}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-lg hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Sending…' : isPastDeadline ? 'RSVP closed' : 'Submit RSVP'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
