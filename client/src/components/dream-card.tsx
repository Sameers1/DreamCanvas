import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Dream } from "@shared/schema";
import DreamAnalysisPopup from "./DreamAnalysisPopup";
import { cn } from "@/lib/utils";
import { StarFilledIcon, StarIcon } from "@/components/icons/StarIcons";

interface DreamCardProps {
  dream: Dream;
}

export function DreamCard({ dream }: DreamCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // For 3D tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for parallax effect
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const imgScale = useTransform(y, [-100, 0, 100], [1.05, 1, 1.05]);
  
  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to card center
    const xPos = e.clientX - rect.left - width / 2;
    const yPos = e.clientY - rect.top - height / 2;
    
    // Update motion values
    x.set(xPos);
    y.set(yPos);
  };
  
  // Reset position when mouse leaves the card
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/dreams/${dream.id}/favorite`, { 
        isFavorite: !isFavorite 
      });
      return response.json();
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      
      // Animated toast notification
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "Dream removed from your favorites" 
          : "Dream added to your favorites",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: error.message || "Failed to update favorite status.",
      });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };

  const formattedDate = new Date(dream.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Calculate mood color based on dream mood
  const getMoodColor = () => {
    switch(dream.mood) {
      case 'calm': return 'bg-blue-500';
      case 'mysterious': return 'bg-purple-500';
      case 'vibrant': return 'bg-green-500';
      case 'dark': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  // Add handler for view details
  const handleViewDetails = () => {
    setShowAnalysis(true);
  };

  return (
    <motion.div 
      ref={cardRef}
      className="h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="h-full"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(159, 122, 234, 0.3)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      >
        <Card className="dream-card relative overflow-hidden bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700 h-full">
          {/* Animated glow effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-dreamPurple/20 to-mysticViolet/10 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="aspect-square relative overflow-hidden">
            <motion.img 
              src={dream.image_url} 
              alt={dream.title} 
              className="w-full h-full object-cover"
              style={{
                scale: imgScale,
                transformStyle: "preserve-3d",
                zIndex: 1
              }}
              whileHover={{ filter: "brightness(1.1)" }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-deepSpace via-transparent to-transparent"></div>
            
            {/* Image shine effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0"
              style={{
                backgroundSize: "200% 200%",
                backgroundPosition: "100% 100%",
                mixBlendMode: "overlay"
              }}
              animate={{
                backgroundPosition: isHovered ? "0% 0%" : "100% 100%",
                opacity: isHovered ? 0.1 : 0
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* Style badge */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-mysticViolet text-white py-1 px-2 shadow-glow"
              >
                {dream.style}
              </Badge>
              
              {/* Mood indicator */}
              <Badge 
                variant="outline" 
                className={`text-xs text-white py-1 px-2 ${getMoodColor()}`}
              >
                {dream.mood}
              </Badge>
            </div>
            
            {/* Favorite button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-3 right-3 p-2 bg-nightGrey bg-opacity-70 backdrop-blur-sm rounded-full hover:bg-mysticViolet border border-mysticViolet/50 transition-colors"
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isPending}
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'fill-cosmicPink text-cosmicPink' : 'text-starlight'}`} 
                />
                
                {/* Animated sparkles when favorited */}
                {isFavorite && (
                  <motion.div
                    className="absolute -inset-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Sparkles className="h-6 w-6 text-cosmicPink/70" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>
          
          <CardContent className="p-4 relative z-10">
            <motion.h3 
              className="font-poppins font-semibold text-lg mb-2 text-white truncate"
              style={{
                textShadow: "0 0 10px rgba(0,0,0,0.3)",
                transformStyle: "preserve-3d",
                translateZ: 30
              }}
            >
              {dream.title}
            </motion.h3>
            
            <motion.p 
              className="text-starlight text-sm line-clamp-2 mb-3"
              style={{
                transformStyle: "preserve-3d",
                translateZ: 20
              }}
            >
              {dream.description}
            </motion.p>
            
            {/* Elements chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {dream.elements.map((element, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs bg-deepSpace/50 text-starlight border-mysticViolet/30"
                >
                  {element}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/20"
                onClick={handleViewDetails}
              >
                View Dream
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-primary/20",
                  isFavorite && "text-yellow-500 hover:text-yellow-600"
                )}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? <StarFilledIcon /> : <StarIcon />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dream Analysis Popup */}
      <DreamAnalysisPopup
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        dream={dream}
      />
    </motion.div>
  );
}
