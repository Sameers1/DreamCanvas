import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DreamInput } from "@/components/dream-input";
import { DreamVisualization } from "@/components/dream-visualization";
import { DreamGallery } from "@/components/dream-gallery";
import { BubbleBackground } from "@/components/ui/bubble-background";
import { SpaceScene } from "@/components/ui/space-scene";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Moon, Sparkles, Stars, Sun } from "lucide-react";

// 3D Text component for hero section
const DreamyTextEffect = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 20, rotateX: 90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: "1000px"
      }}
    >
      {/* Text shadow/3D depth effect */}
      <span className="absolute -z-10 select-none text-dreamPurple opacity-40 blur-[2px]"
        style={{ transform: "translateZ(-4px) translateY(4px)" }}>
        {children}
      </span>
      
      {/* Main text */}
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Glow overlay */}
      <motion.span 
        className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-enchantedBlue/30 to-transparent opacity-0"
        animate={{ 
          opacity: [0, 0.7, 0],
          x: ["-100%", "100%"] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatDelay: 5 + Math.random() * 7 
        }}
      />
    </motion.div>
  );
};

// Floating object component
const FloatingObject = ({ 
  Icon, 
  size = 24, 
  left, 
  top, 
  duration = 6,
  delay = 0,
  rotation = 0,
  color = "text-mysticViolet"
}: {
  Icon: React.ComponentType<any>;
  size?: number;
  left: string;
  top: string;
  duration?: number;
  delay?: number;
  rotation?: number;
  color?: string;
}) => {
  return (
    <motion.div
      className={`absolute ${color}`}
      style={{ left, top }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: rotation,
        }}
        transition={{ 
          y: { duration, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: duration * 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Icon size={size} />
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [currentDream, setCurrentDream] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showSpaceScene, setShowSpaceScene] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // For parallax effect on scroll
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const headerBgOpacity = useTransform(scrollY, [0, 300], [0, 1]);

  // Show space scene after delay to improve initial load performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpaceScene(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGeneratedDream = (dreamData: any) => {
    setCurrentDream(dreamData);
    setIsGenerating(false);
    setHasError(false);
  };

  const handleReset = () => {
    setCurrentDream(null);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsGenerating(true);
    // In a real implementation, we would re-trigger the generation here
    // For now, we'll just simulate failure to show both states
    setTimeout(() => {
      setIsGenerating(false);
      setHasError(true);
    }, 2000);
  };

  const scrollToInput = () => {
    setShowInput(true);
    setTimeout(() => {
      const dreamInput = document.getElementById('dream-input');
      if (dreamInput) {
        dreamInput.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="bg-deepSpace min-h-screen font-space text-starlight overflow-x-hidden">
      <BubbleBackground />
      {showSpaceScene && <SpaceScene />}
      
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="min-h-[100vh] flex flex-col items-center justify-center px-6 text-center relative"
        >
          {/* Floating decorative elements */}
          <FloatingObject Icon={Stars} size={32} left="15%" top="25%" duration={8} delay={0.2} color="text-enchantedBlue" />
          <FloatingObject Icon={Moon} size={28} left="75%" top="30%" duration={10} delay={0.5} rotation={15} color="text-cosmicPink" />
          <FloatingObject Icon={Sun} size={24} left="25%" top="70%" duration={12} delay={0.8} rotation={-10} color="text-yellow-400" />
          <FloatingObject Icon={Stars} size={20} left="80%" top="65%" duration={9} delay={1.1} color="text-mysticViolet" />
          
          <motion.div
            style={{
              y: titleY,
              opacity: titleOpacity,
            }}
            className="z-10"
          >
            {/* 3D animated title with letter-by-letter animation */}
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-8 text-white overflow-hidden">
              <div className="mb-2">
                {Array.from("Dream").map((letter, i) => (
                  <DreamyTextEffect key={`title-1-${i}`} delay={0.1 + i * 0.1}>
                    {letter === " " ? "\u00A0" : letter}
                  </DreamyTextEffect>
                ))}
              </div>
              <div className="mb-2">
                {Array.from("Visualizer").map((letter, i) => (
                  <DreamyTextEffect key={`title-2-${i}`} delay={0.5 + i * 0.08}>
                    {letter === " " ? "\u00A0" : letter}
                  </DreamyTextEffect>
                ))}
              </div>
              <div>
                {Array.from("AI").map((letter, i) => (
                  <DreamyTextEffect key={`title-3-${i}`} delay={1.3 + i * 0.1}>
                    {letter === " " ? "\u00A0" : letter}
                  </DreamyTextEffect>
                ))}
              </div>
            </h1>
            
            {/* Glowing underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-dreamPurple via-enchantedBlue to-mysticViolet rounded-full mx-auto glow"
              style={{ width: '80px' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '180px', opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            />
            
            <motion.div
              className="text-xl md:text-2xl max-w-2xl mx-auto mt-12 mb-10 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <p className="mb-4 text-shadow leading-relaxed">Transform your dreams into stunning visual art with the power of AI.</p>
              <p className="text-shadow-lg leading-relaxed">Journey through your subconscious and see your dreams come to life.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="mb-16"
            >
              <Button 
                onClick={scrollToInput}
                size="lg" 
                className="text-lg p-6 rounded-full shadow-glow bg-gradient-to-r from-dreamPurple to-mysticViolet hover:from-mysticViolet hover:to-enchantedBlue transition-all duration-300 transform hover:scale-105 group glow relative overflow-hidden"
              >
                {/* Button sparkle effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{ 
                    mixBlendMode: 'overlay',
                    backgroundSize: '200% 100%'
                  }}
                  animate={{
                    backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                />
                
                <Sparkles className="mr-3 h-5 w-5 animate-pulse" />
                <span>Visualize Your Dream</span>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 3 }}
            className="absolute bottom-10"
          >
            <ChevronDownIcon 
              onClick={scrollToInput}
              className="h-10 w-10 cursor-pointer animate-bounce text-white opacity-70 hover:opacity-100"
            />
          </motion.div>
        </section>
        
        {/* Dream Input Section */}
        <div id="dream-input" className="container mx-auto px-6 py-8">
          {(!currentDream && !isGenerating && !hasError) ? (
            showInput ? (
              <DreamInput 
                onGeneratedDream={(dreamData) => {
                  setIsGenerating(true);
                  // Simulate API call delay
                  setTimeout(() => handleGeneratedDream(dreamData), 2000);
                }} 
              />
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button 
                  onClick={scrollToInput}
                  size="lg" 
                  className="text-lg p-6 rounded-full bg-gradient-to-r from-dreamPurple to-mysticViolet hover:from-mysticViolet hover:to-enchantedBlue"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  <span>Start Your Dream Journey</span>
                </Button>
              </motion.div>
            )
          ) : (
            <DreamVisualization 
              dreamData={currentDream}
              isGenerating={isGenerating}
              hasError={hasError}
              onReset={handleReset}
              onRetry={handleRetry}
            />
          )}
        </div>
        
        {/* Gallery Section */}
        <section className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center gradient-text">Dream Gallery</h2>
            <DreamGallery />
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
