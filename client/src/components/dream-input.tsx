import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DreamAnalysisPopup from './DreamAnalysisPopup';
import { generateDreamSchema } from "@shared/schema";
import type { GenerateDreamRequest } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from 'wouter';

interface DreamInputProps {
  onDreamGenerated?: (dream: any) => void;
}

export function DreamInput({ onDreamGenerated }: DreamInputProps) {
  const { toast } = useToast();
  const { user, signIn } = useAuth();
  const [, setLocation] = useLocation();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentDream, setCurrentDream] = useState<{
    title: string;
    description: string;
    image_url: string;
    style: string;
    mood: string;
    elements: string[];
  } | null>(null);

  const form = useForm<GenerateDreamRequest>({
    resolver: zodResolver(generateDreamSchema),
    defaultValues: {
      description: "",
      style: "artistic",
      mood: "calm",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateDreamRequest) => {
      if (!user) {
        throw new Error('You must be logged in to generate dreams');
      }
      
      const response = await apiRequest('POST', '/api/dreams/generate', data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Dream generated successfully:', data);
      setCurrentDream(data);
      setShowAnalysis(true);
      onDreamGenerated?.(data);
    },
    onError: (error: Error) => {
      console.error('Error generating dream:', error);
      toast({
        variant: "destructive",
        title: "Failed to generate dream",
        description: error.message || "Please try again later",
      });
    },
  });

  const onSubmit = async (data: GenerateDreamRequest) => {
    if (!user) {
      try {
        await signIn();
      } catch (error) {
        console.error('Error signing in:', error);
        toast({
          variant: "destructive",
          title: "Sign in required",
          description: "Please sign in to generate dreams",
        });
      }
      return;
    }

    if (!data.description.trim()) {
      toast({
        variant: "destructive",
        title: "Description required",
        description: "Please describe your dream",
      });
      return;
    }
    generateMutation.mutate(data);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto mb-16"
      >
        <Card className="bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700 relative overflow-hidden group">
          {/* Dreamy glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-dreamPurple/20 via-mysticViolet/10 to-enchantedBlue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Animated sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Dream creation effect - only visible during generation */}
          {generateMutation.isPending && (
            <>
              {/* Pulsing glow ring */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dreamPurple/30 via-mysticViolet/20 to-enchantedBlue/30 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-dreamPurple/20 via-mysticViolet/10 to-enchantedBlue/20 animate-pulse-slow [animation-delay:0.5s]"></div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Magical swirls */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-spin-slow opacity-50"></div>
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-spin-slow opacity-30 [animation-delay:1s]"></div>
              </div>
            </>
          )}
          
          <CardContent className="p-6 relative z-10">
            <h2 className="text-2xl font-poppins font-semibold mb-6 text-starlight relative">
              Describe Your Dream
              <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-dreamPurple to-mysticViolet rounded-full"></span>
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="I dreamt of floating through a cosmic forest with bioluminescent trees and creatures made of stardust..."
                          className="w-full bg-nightGrey/50 backdrop-blur-sm text-starlight placeholder-gray-400/70 border-mysticViolet/30 rounded-xl p-6 h-40 focus:ring-mysticViolet/50 focus:border-mysticViolet/50 transition-all duration-300 ease-in-out hover:border-mysticViolet/50 shadow-lg shadow-dreamPurple/10 relative overflow-hidden"
                          style={{
                            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                            letterSpacing: "1.2px",
                            lineHeight: "2",
                            fontSize: "1.5rem",
                            color: "#E2E8F0",
                            backgroundColor: "rgba(17, 24, 39, 0.5)",
                            textShadow: "0 0 15px rgba(139, 92, 246, 0.4), 0 0 5px rgba(139, 92, 246, 0.2)",
                            fontWeight: "300",
                            fontStyle: "italic",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            boxShadow: "0 0 20px rgba(139, 92, 246, 0.1), 0 0 40px rgba(139, 92, 246, 0.05)",
                            transition: "all 0.3s ease-in-out",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-nightGrey/50 backdrop-blur-sm text-starlight border-mysticViolet/30 hover:border-mysticViolet/50 transition-all duration-300">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-nightGrey border-mysticViolet/30">
                            <SelectItem value="artistic">Artistic</SelectItem>
                            <SelectItem value="realistic">Realistic</SelectItem>
                            <SelectItem value="surreal">Surreal</SelectItem>
                            <SelectItem value="fantasy">Fantasy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-nightGrey/50 backdrop-blur-sm text-starlight border-mysticViolet/30 hover:border-mysticViolet/50 transition-all duration-300">
                              <SelectValue placeholder="Select mood" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-nightGrey border-mysticViolet/30">
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="vibrant">Vibrant</SelectItem>
                            <SelectItem value="mysterious">Mysterious</SelectItem>
                            <SelectItem value="ethereal">Ethereal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button 
                    type="submit" 
                    className={`w-full sm:w-auto relative overflow-hidden group ${
                      user 
                        ? "bg-gradient-to-r from-dreamPurple to-mysticViolet hover:from-mysticViolet hover:to-dreamPurple" 
                        : "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400"
                    } text-white shadow-lg shadow-dreamPurple/20 hover:shadow-dreamPurple/40 transition-all duration-300`}
                    disabled={generateMutation.isPending}
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {generateMutation.isPending ? (
                      <span className="flex items-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : !user ? (
                      <span className="flex items-center relative z-10">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in to Generate
                      </span>
                    ) : (
                      <span className="flex items-center relative z-10">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Visualize Dream
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.section>

      {currentDream && (
        <DreamAnalysisPopup
          isOpen={showAnalysis}
          onClose={() => setShowAnalysis(false)}
          dream={currentDream}
        />
      )}
    </>
  );
}
