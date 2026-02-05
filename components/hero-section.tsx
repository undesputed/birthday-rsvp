export function HeroSection() {
  return (
    <section id="home" className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-background to-accent/30 flex items-center justify-center px-3 sm:px-4 py-16 sm:py-20 mt-16 sm:mt-20 relative overflow-hidden">
      {/* Decorative bear paws - hidden on very small screens */}
      <div className="hidden sm:block absolute top-10 left-10 text-4xl sm:text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0s' }}>
        🐾
      </div>
      <div className="hidden md:block absolute bottom-20 right-10 text-4xl sm:text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        🐾
      </div>
      <div className="hidden lg:block absolute top-1/3 right-20 text-3xl sm:text-4xl opacity-15 animate-bounce" style={{ animationDelay: '1s' }}>
        🐾
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="mb-4 sm:mb-6 inline-flex items-center justify-center">
          <div className="text-5xl sm:text-7xl md:text-8xl animate-pulse">🐻</div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 sm:mb-4 text-balance drop-shadow-lg">
          You're Invited!
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-6 sm:mb-8 text-balance font-semibold px-2">
          Join us for a special birthday celebration
        </p>

        <div className="bg-gradient-to-br from-secondary/80 to-accent/40 backdrop-blur-sm border-3 sm:border-4 border-primary/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 inline-block shadow-xl mx-2 sm:mx-0">
          <p className="text-base sm:text-lg md:text-xl text-foreground font-bold mb-2 sm:mb-3">
            A day filled with joy, fun, and friendship!
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-2xl sm:text-3xl">
            🎉 🎂 🎈
          </div>
          <p className="text-sm sm:text-base text-foreground/70 font-medium">
            Scroll down to RSVP and learn more details
          </p>
        </div>

        {/* Decorative balloons */}
        <div className="mt-8 sm:mt-12 flex justify-center gap-4 sm:gap-6 text-2xl sm:text-4xl animate-bounce">
          <span style={{ animationDelay: '0s' }}>🎈</span>
          <span style={{ animationDelay: '0.2s' }}>🎈</span>
          <span style={{ animationDelay: '0.4s' }}>🎈</span>
        </div>
      </div>
    </section>
  );
}
