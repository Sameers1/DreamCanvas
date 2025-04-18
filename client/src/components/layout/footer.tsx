import { motion } from "framer-motion";
import { Anchor, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <motion.footer 
      className="bg-nightGrey bg-opacity-60 backdrop-blur-sm py-8 border-t border-gray-700 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-br from-dreamPurple to-mysticViolet flex items-center justify-center">
              <Anchor className="text-starlight h-4 w-4" />
            </div>
            <p className="text-starlight font-poppins font-medium">
              Dream<span className="text-mysticViolet">AI</span> Visualizer
            </p>
          </div>
          
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-mysticViolet transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-mysticViolet transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-mysticViolet transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} DreamAI Visualizer. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-mysticViolet transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-mysticViolet transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-mysticViolet transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
