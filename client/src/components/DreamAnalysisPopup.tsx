import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface DreamAnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dream: {
    title: string;
    description: string;
    imageUrl: string;
    elements?: string[];
    style?: string;
    mood?: string;
  };
}

const DreamAnalysisPopup: React.FC<DreamAnalysisPopupProps> = ({ isOpen, onClose, dream }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to save dreams");
      
      const dreamData = {
        ...dream,
        style: dream.style || 'artistic',
        mood: dream.mood || 'calm',
        createdAt: new Date().toISOString(),
        user_id: user.id
      };
      const response = await apiRequest("POST", "/api/dreams", dreamData);
      return response.json();
    },
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      toast({
        title: "Dream saved!",
        description: "Your dream has been saved to your collection.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to save your dream. Please try again.",
      });
    },
  });

  const handleSaveDream = () => {
    if (!isSaved) {
      saveMutation.mutate();
    }
  };

  const handleShareDream = () => {
    if (navigator.share) {
      navigator.share({
        title: dream.title || 'My Dream Visualization',
        text: dream.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support the Web Share API.",
      });
    }
  };

  // Generate symbolic meaning based on elements, style, and mood
  const generateSymbolicMeaning = () => {
    const elements = dream.elements || [];
    const style = dream.style || 'artistic';
    const mood = dream.mood || 'calm';

    // Create a more meaningful analysis based on the elements
    const elementAnalysis = elements.length > 0
      ? elements.map(element => {
          const elementLower = element.toLowerCase();
          // Add some basic symbolic interpretations
          if (elementLower.includes('water')) return 'represents emotions and the subconscious';
          if (elementLower.includes('fire')) return 'symbolizes transformation and passion';
          if (elementLower.includes('air')) return 'suggests freedom and new perspectives';
          if (elementLower.includes('earth')) return 'indicates stability and grounding';
          if (elementLower.includes('light')) return 'represents clarity and enlightenment';
          if (elementLower.includes('dark')) return 'suggests the unknown and hidden aspects';
          if (elementLower.includes('tree')) return 'symbolizes growth and connection';
          if (elementLower.includes('animal')) return 'represents instincts and natural drives';
          return `represents ${elementLower}`;
        }).join(', ')
      : 'various aspects of your subconscious';

    // Style interpretation
    const styleInterpretation = {
      artistic: 'creative expression and imagination',
      realistic: 'practical concerns and daily life',
      surreal: 'unconscious thoughts and hidden meanings',
      fantasy: 'aspirations and ideal scenarios'
    }[style] || 'your current state of mind';

    // Mood interpretation
    const moodInterpretation = {
      calm: 'inner peace and balance',
      vibrant: 'energy and enthusiasm',
      mysterious: 'unexplored aspects of yourself',
      ethereal: 'spiritual or transcendent experiences'
    }[mood] || 'your emotional state';

    return `This dream appears to be exploring themes of ${elementAnalysis}. The ${style} style suggests ${styleInterpretation}, while the ${mood} mood indicates ${moodInterpretation}. The dream invites you to reflect on these elements and their significance in your waking life.`;
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose()}
    >
      <DialogContent className="bg-deepSpace border border-mysticViolet/30 text-starlight max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            Dream Analysis
          </DialogTitle>
          <DialogDescription className="text-starlight/80">
            Explore the deeper meaning of your dream
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dream Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={dream.imageUrl}
              alt={dream.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepSpace/80 to-transparent" />
          </div>

          {/* Analysis Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Symbolic Meaning</h3>
              <p className="text-starlight/90">{generateSymbolicMeaning()}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="border-mysticViolet/30 text-starlight hover:bg-mysticViolet/20"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DreamAnalysisPopup; 