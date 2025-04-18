import { useState } from "react";
import { DreamInput } from "@/components/dream-input";
import { DreamVisualization } from "@/components/dream-visualization";
import { DreamGallery } from "@/components/dream-gallery";
import { BubbleBackground } from "@/components/ui/bubble-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  const [currentDream, setCurrentDream] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  return (
    <div className="bg-deepSpace min-h-screen font-space text-starlight">
      <BubbleBackground />
      
      <Header />
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        {!currentDream && !isGenerating && !hasError ? (
          <DreamInput 
            onGeneratedDream={(dreamData) => {
              setIsGenerating(true);
              // Simulate API call delay
              setTimeout(() => handleGeneratedDream(dreamData), 2000);
            }} 
          />
        ) : (
          <DreamVisualization 
            dreamData={currentDream}
            isGenerating={isGenerating}
            hasError={hasError}
            onReset={handleReset}
            onRetry={handleRetry}
          />
        )}
        
        <DreamGallery />
      </main>
      
      <Footer />
    </div>
  );
}
