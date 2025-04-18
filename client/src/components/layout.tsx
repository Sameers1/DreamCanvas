import Footer from './Footer';
import DreamBackground from './DreamBackground';
import DreamParticles from './DreamParticles';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DreamBackground />
      <DreamParticles />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* ... existing header code ... */}
      </header>
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
} 