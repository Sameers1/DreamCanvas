import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Save, Share2, AlertTriangle } from "lucide-react";
import { dreamFadeIn } from "@/lib/animations";
import type { Dream } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";

interface DreamVisualizationProps {
  dreamData: any;
  isGenerating: boolean;
  hasError: boolean;
  onReset: () => void;
  onRetry: () => void;
}

export function DreamVisualization({ 
  dreamData, 
  isGenerating, 
  hasError, 
  onReset, 
  onRetry 
}: DreamVisualizationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to save dreams");
      
      const data = {
        ...dreamData,
        user_id: user.id
      };
      const response = await apiRequest("POST", "/api/dreams", data);
      return response.json();
    },
    onSuccess: (data: Dream) => {
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
        title: dreamData.title || 'My Dream Visualization',
        text: dreamData.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support the Web Share API.",
      });
    }
  };

  if (isGenerating) {
    return (
      <motion.section {...dreamFadeIn} className="max-w-4xl mx-auto mb-16">
        <Card className="bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700 text-center">
          <CardContent className="py-12">
            <div className="inline-block rounded-full bg-dreamPurple bg-opacity-20 p-8 mb-6">
              <div className="animate-pulse">
                <RefreshCw className="h-12 w-12 text-mysticViolet animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-poppins font-medium mb-3 text-starlight">Visualizing your dream...</h3>
            <p className="text-gray-400 max-w-lg mx-auto">Our AI is interpreting your dream and creating a unique visualization. This typically takes 15-30 seconds.</p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }

  if (hasError) {
    return (
      <motion.section {...dreamFadeIn} className="max-w-4xl mx-auto mb-16">
        <Card className="bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700 text-center">
          <CardContent className="py-12">
            <div className="inline-block rounded-full bg-red-500 bg-opacity-20 p-8 mb-6">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-xl font-poppins font-medium mb-3 text-starlight">Visualization Failed</h3>
            <p className="text-gray-400 max-w-lg mx-auto">We couldn't generate your dream visualization. This might be due to API limits or network issues.</p>
            <Button 
              variant="outline"
              className="mt-6 bg-deepSpace hover:bg-opacity-90 text-starlight border-gray-600"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.section>
    );
  }

  if (!dreamData) return null;

  const extractedElements = dreamData.elements || [];
  
  return (
    <motion.section {...dreamFadeIn} className="max-w-4xl mx-auto mb-16">
      <Card className="bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg aspect-square relative">
              {dreamData.imageUrl && (
                <img 
                  src={dreamData.imageUrl} 
                  alt={`Visualization of ${dreamData.title || 'a dream'}`}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deepSpace to-transparent p-4">
                <div className="flex justify-between items-center">
                  <Badge 
                    variant="secondary" 
                    className="bg-dreamPurple bg-opacity-70 text-white"
                  >
                    {dreamData.style} Style
                  </Badge>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-nightGrey bg-opacity-70 rounded-full hover:bg-mysticViolet transition-colors" 
                      onClick={handleSaveDream}
                      disabled={isSaved || saveMutation.isPending}
                    >
                      <Save className="h-4 w-4 text-starlight" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-nightGrey bg-opacity-70 rounded-full hover:bg-mysticViolet transition-colors" 
                      onClick={handleShareDream}
                    >
                      <Share2 className="h-4 w-4 text-starlight" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-poppins font-semibold mb-3 text-starlight">{dreamData.title || 'Dream Visualization'}</h3>
              <p className="text-gray-300 mb-6">{dreamData.description}</p>
              
              <div className="mb-6">
                <h4 className="font-poppins font-medium text-starlight mb-2">Dream Elements</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedElements.map((element: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-dreamPurple bg-opacity-30 text-mysticViolet">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-poppins font-medium text-starlight mb-2">Generation Details</h4>
                <div className="bg-deepSpace bg-opacity-70 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Created</span>
                    <span className="text-starlight">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Style</span>
                    <span className="text-starlight">{dreamData.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mood</span>
                    <span className="text-starlight">{dreamData.mood}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full bg-nightGrey hover:bg-opacity-90 text-starlight border-gray-600"
                  onClick={onReset}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New Visualization
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
