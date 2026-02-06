import { MapPin, Clock, Calendar, Gift, Utensils, Music, AlertCircle } from 'lucide-react';

export function EventDetails() {
  return (
    <section id="details" className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-br from-secondary/50 via-background to-primary/10 relative">
      {/* Decorative elements - hidden on small screens */}
      <div className="hidden sm:block absolute top-5 left-5 text-3xl sm:text-5xl opacity-15">🐻</div>
      <div className="hidden sm:block absolute bottom-5 right-5 text-3xl sm:text-5xl opacity-15">🐻</div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-2">
          Celebration Details
        </h2>
        <div className="flex justify-center gap-1 sm:gap-2 mb-8 sm:mb-12 text-2xl sm:text-3xl">
          📍 ⏰ 🎪
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          {/* Location Card */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg sm:rounded-2xl p-4 sm:p-8 border-2 sm:border-3 border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-primary text-primary-foreground p-2 sm:p-4 rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg">
                <MapPin className="w-5 sm:w-8 h-5 sm:h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl text-foreground mb-1 sm:mb-2">Location</h3>
                <p className="text-foreground/80 font-semibold text-sm sm:text-lg">
                  🐻 JOLLIBEE – Casuntingan
                </p>
                <p className="text-foreground/70 mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed">
                  693 M. L. Quezon Avenue, Casuntingan, 6014 Mandaue City, Cebu, Philippines
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time Card */}
          <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-lg sm:rounded-2xl p-4 sm:p-8 border-2 sm:border-3 border-accent/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-accent text-accent-foreground p-2 sm:p-4 rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg">
                <Calendar className="w-5 sm:w-8 h-5 sm:h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl text-foreground mb-1 sm:mb-2">Date & Time</h3>
                <p className="text-foreground/80 font-semibold text-sm sm:text-lg">
                  Feb 12, 2026
                </p>
                <p className="text-foreground/80 font-semibold text-sm sm:text-lg mt-1">
                  7:00 PM - 9:00 PM
                </p>
                <p className="text-foreground/70 text-xs sm:text-sm mt-1">
                  Fun starts at 7!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {/* What to Bring */}
          <div className="bg-gradient-to-br from-secondary/40 to-primary/5 rounded-lg sm:rounded-2xl p-4 sm:p-6 border-2 border-secondary/40 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-secondary text-foreground p-2 sm:p-3 rounded-lg">
                <Gift className="w-4 sm:w-6 h-4 sm:h-6" />
              </div>
              <h4 className="font-bold text-foreground text-sm sm:text-lg">What to Bring</h4>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-foreground/70 text-xs sm:text-sm">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Wrapped gift (optional)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Good spirit and big smile!</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Comfortable clothes for games</span>
              </li>
            </ul>
          </div>

          {/* Activities */}
          <div className="bg-gradient-to-br from-accent/40 to-primary/5 rounded-lg sm:rounded-2xl p-4 sm:p-6 border-2 border-accent/40 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-accent text-accent-foreground p-2 sm:p-3 rounded-lg">
                <Music className="w-4 sm:w-6 h-4 sm:h-6" />
              </div>
              <h4 className="font-bold text-foreground text-sm sm:text-lg">Activities</h4>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-foreground/70 text-xs sm:text-sm">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Fun party games</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Dancing and music</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Prize giveaways</span>
              </li>
            </ul>
          </div>

          {/* Food & Drinks */}
          <div className="bg-gradient-to-br from-primary/30 to-accent/5 rounded-lg sm:rounded-2xl p-4 sm:p-6 border-2 border-primary/30 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-primary text-primary-foreground p-2 sm:p-3 rounded-lg">
                <Utensils className="w-4 sm:w-6 h-4 sm:h-6" />
              </div>
              <h4 className="font-bold text-foreground text-sm sm:text-lg">Food & Drinks</h4>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-foreground/70 text-xs sm:text-sm">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Delicious Jollibee meals</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Birthday cake & treats</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Refreshments & desserts</span>
              </li>
            </ul>
          </div>

          {/* Important Notes */}
          <div className="bg-gradient-to-br from-orange-100/50 to-primary/5 rounded-lg sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-200/60 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-orange-200 text-foreground p-2 sm:p-3 rounded-lg">
                <AlertCircle className="w-4 sm:w-6 h-4 sm:h-6" />
              </div>
              <h4 className="font-bold text-foreground text-sm sm:text-lg">Important</h4>
            </div>
            <ul className="space-y-1 sm:space-y-2 text-foreground/70 text-xs sm:text-sm">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>RSVP by date</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Tell us dietary needs</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Be on time for fun!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-3 border-primary/20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.953129245193!2d123.92793847503576!3d10.345632989778164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99972dea24acb%3A0xcf62bc2c6f10d886!2sJollibee%20%E2%80%93%20Casuntingan!5e0!3m2!1sen!2sph!4v1770272386967!5m2!1sen!2sph"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-6 sm:mt-8">
          <p className="text-foreground font-semibold text-base sm:text-lg mb-2 sm:mb-3">
            Get ready for an unforgettable celebration!
          </p>
          <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
            Filled with games, fun, laughter, and delicious treats. We can't wait to celebrate with you at Jollibee Casuntingan Mandaue. This will be a day full of joy and memories that we'll cherish together!
          </p>
        </div>
      </div>
    </section>
  );
}
