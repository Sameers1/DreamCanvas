import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { dreamHoverCard } from "@/lib/animations";
import { formatDistanceToNow } from "date-fns";
import type { Dream } from "@shared/schema";

interface DreamCardProps {
  dream: Dream;
}

export function DreamCard({ dream }: DreamCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(dream.isFavorite);
  
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

  const formattedDate = formatDistanceToNow(new Date(dream.createdAt), { addSuffix: true });
  
  return (
    <motion.div variants={dreamHoverCard} whileHover="whileHover">
      <Card className="dream-card bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700 h-full">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={dream.imageUrl} 
            alt={dream.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepSpace via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant="secondary" 
              className="text-xs bg-dreamPurple bg-opacity-70 text-white py-1 px-2"
            >
              {dream.style}
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-3 right-3 p-2 bg-nightGrey bg-opacity-70 rounded-full hover:bg-mysticViolet transition-colors"
            onClick={handleToggleFavorite}
            disabled={toggleFavoriteMutation.isPending}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-pink-400 text-pink-400' : 'text-starlight'}`} 
            />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-poppins font-medium text-lg mb-1 text-starlight truncate">{dream.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{dream.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{formattedDate}</span>
            <Button 
              variant="link" 
              className="text-mysticViolet hover:text-starlight p-0 h-auto"
              asChild
            >
              <a href={`/dream/${dream.id}`}>View Dream →</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
