import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Wand2 } from "lucide-react";
import { dreamFadeIn } from "@/lib/animations";
import { generateDreamSchema } from "@shared/schema";
import type { GenerateDreamRequest } from "@shared/schema";

interface DreamInputProps {
  onGeneratedDream: (dreamData: any) => void;
}

export function DreamInput({ onGeneratedDream }: DreamInputProps) {
  const { toast } = useToast();
  
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
      const response = await apiRequest("POST", "/api/dreams/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      onGeneratedDream(data);
      toast({
        title: "Dream visualized!",
        description: "Your dream has been transformed into an image.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Failed to generate dream image. Please try again.",
      });
    },
  });

  function onSubmit(data: GenerateDreamRequest) {
    generateMutation.mutate(data);
  }

  return (
    <motion.section {...dreamFadeIn} className="max-w-3xl mx-auto mb-16">
      <Card className="bg-nightGrey bg-opacity-60 backdrop-blur-sm border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-poppins font-semibold mb-6 text-starlight">Describe Your Dream</h2>
          
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
                        className="w-full bg-deepSpace bg-opacity-70 text-starlight placeholder-gray-400 border-gray-600 rounded-lg p-4 h-32 focus:ring-mysticViolet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-dreamPurple to-mysticViolet hover:from-mysticViolet hover:to-dreamPurple text-white"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Wand2 className="mr-2 h-4 w-4" />
                      Visualize Dream
                    </span>
                  )}
                </Button>
                
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-auto">
                      <div className="bg-deepSpace bg-opacity-70 rounded-lg px-5 py-2 border border-gray-700 flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Style:</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-transparent border-none w-auto focus:ring-0">
                            <SelectValue placeholder="Style" />
                          </SelectTrigger>
                          <SelectContent className="bg-deepSpace border-gray-700">
                            <SelectItem value="artistic">Artistic</SelectItem>
                            <SelectItem value="surreal">Surreal</SelectItem>
                            <SelectItem value="ethereal">Ethereal</SelectItem>
                            <SelectItem value="cosmic">Cosmic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-auto">
                      <div className="bg-deepSpace bg-opacity-70 rounded-lg px-5 py-2 border border-gray-700 flex items-center justify-between">
                        <Label className="text-sm text-gray-300">Mood:</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-transparent border-none w-auto focus:ring-0">
                            <SelectValue placeholder="Mood" />
                          </SelectTrigger>
                          <SelectContent className="bg-deepSpace border-gray-700">
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="mysterious">Mysterious</SelectItem>
                            <SelectItem value="vibrant">Vibrant</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.section>
  );
}
