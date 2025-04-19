import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Dream } from "@shared/schema";

interface DreamAnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dream: {
    title: string;
    description: string;
    image_url: string;
    style?: string;
    mood?: string;
    elements?: string[];
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
        title: dream.title,
        description: dream.description,
        image_url: dream.image_url,
        style: dream.style || 'artistic',
        mood: dream.mood || 'calm',
        elements: dream.elements || [],
        user_id: user.id,
        is_favorite: false
      };
      
      console.log('Saving dream with data:', dreamData);
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
    onError: (error: Error) => {
      console.error('Save mutation error:', error);
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

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-nightGrey border-gray-700 text-starlight max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins">{dream.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            {dream.image_url ? (
              <img
                src={dream.image_url}
                alt={dream.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', dream.image_url);
                  e.currentTarget.src = 'fallback-image-url'; // You can add a fallback image
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-deepSpace">
                <p className="text-starlight">No image available</p>
              </div>
            )}
          </motion.div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300">{dream.description}</p>
            </div>
            
            {(dream.style || dream.mood) && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Attributes</h3>
                <div className="flex flex-wrap gap-2">
                  {dream.style && (
                    <Badge variant="outline" className="bg-dreamPurple/10">
                      Style: {dream.style}
                    </Badge>
                  )}
                  {dream.mood && (
                    <Badge variant="outline" className="bg-mysticViolet/10">
                      Mood: {dream.mood}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {dream.elements && dream.elements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Elements</h3>
                <div className="flex flex-wrap gap-2">
                  {dream.elements.map((element, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-800">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSaveDream}
                disabled={isSaved || saveMutation.isPending}
                className={`flex-1 ${
                  isSaved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-dreamPurple to-mysticViolet hover:from-mysticViolet hover:to-dreamPurple"
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaved ? "Saved" : saveMutation.isPending ? "Saving..." : "Save Dream"}
              </Button>
              
              <Button
                onClick={handleShareDream}
                variant="outline"
                className="flex-1 border-gray-600 hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DreamAnalysisPopup; 