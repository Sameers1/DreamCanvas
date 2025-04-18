import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DreamCard } from "./dream-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dreamFadeIn } from "@/lib/animations";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import type { Dream } from "@shared/schema";

export function DreamGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(8);
  
  const { data: dreams = [], isLoading } = useQuery<Dream[]>({
    queryKey: ['/api/dreams'],
  });

  // Filter dreams based on search term
  const filteredDreams = dreams.filter(dream => 
    dream.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dream.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort dreams based on selected option
  const sortedDreams = [...filteredDreams].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Get dreams to display based on current page
  const visibleDreams = sortedDreams.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <motion.section {...dreamFadeIn} className="mb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-poppins font-semibold text-starlight">Your Dream Collection</h2>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Input 
              type="text" 
              placeholder="Search dreams..." 
              className="bg-nightGrey bg-opacity-60 text-starlight border-gray-600 pl-10 pr-4 text-sm focus:ring-mysticViolet w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Select 
            defaultValue="newest" 
            onValueChange={(value) => setSortOrder(value)}
          >
            <SelectTrigger className="bg-nightGrey bg-opacity-60 text-starlight border-gray-600 text-sm focus:ring-mysticViolet w-full md:w-auto">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-deepSpace border-gray-700">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-mysticViolet animate-spin" />
        </div>
      ) : visibleDreams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleDreams.map((dream) => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
          </div>
          
          {visibleDreams.length < sortedDreams.length && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                className="bg-deepSpace hover:bg-nightGrey text-starlight border-gray-600 inline-flex items-center"
                onClick={handleLoadMore}
              >
                <Loader className="mr-2 h-4 w-4" />
                Load More Dreams
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-poppins font-medium mb-2 text-starlight">No dreams found</h3>
          <p className="text-gray-400">Your dream collection is empty or no dreams match your search.</p>
        </div>
      )}
    </motion.section>
  );
}
