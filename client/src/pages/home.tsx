import { useState } from "react";
import { motion } from "framer-motion";
import { DreamInput } from "@/components/dream-input";
import { DreamVisualization } from "@/components/dream-visualization";
import { DreamGallery } from "@/components/dream-gallery";
import { BubbleBackground } from "@/components/ui/bubble-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Sparkles } from "lucide-react";

export default function Home() {
  const [currentDream, setCurrentDream] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showInput, setShowInput] = useState(false);

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
    <div className="bg-deepSpace min-h-screen font-space text-starlight">
      <BubbleBackground />
      
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text text-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Dream Visualizer AI
          </motion.h1>
          
          <motion.div
            className="text-xl md:text-2xl max-w-2xl mb-10 text-starlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p>Transform your dreams into stunning visual art with the power of AI.</p>
            <p className="mt-4">Journey through your subconscious and see your dreams come to life.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-16"
          >
            <Button 
              onClick={scrollToInput}
              size="lg" 
              className="text-lg p-6 rounded-full shadow-glow bg-gradient-to-r from-dreamPurple to-mysticViolet hover:from-mysticViolet hover:to-enchantedBlue transition-all duration-300 transform hover:scale-105 group glow"
            >
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              <span>Visualize Your Dream</span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 1.2 }}
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
