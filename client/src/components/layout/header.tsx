import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="pt-6 pb-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center relative z-10">
      <motion.div 
        className="flex items-center mb-4 md:mb-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-10 h-10 mr-3 rounded-full bg-gradient-to-br from-dreamPurple to-mysticViolet flex items-center justify-center">
          <Anchor className="text-starlight h-5 w-5" />
        </div>
        <h1 className="text-2xl font-poppins font-bold text-starlight">
          Dream<span className="text-mysticViolet">AI</span> Visualizer
        </h1>
      </motion.div>
      
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ul className="flex space-x-6">
          <li>
            <div className={`text-starlight hover:text-mysticViolet transition-colors font-medium flex items-center ${
              location === "/" ? "text-mysticViolet" : ""
            }`}>
              <Link href="/">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-2 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2" />
                  </svg>
                  Home
                </div>
              </Link>
            </div>
          </li>
          <li>
            <div className={`text-starlight hover:text-mysticViolet transition-colors font-medium flex items-center ${
              location === "/gallery" ? "text-mysticViolet" : ""
            }`}>
              <Link href="/gallery">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-2 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Gallery
                </div>
              </Link>
            </div>
          </li>
        </ul>
      </motion.nav>
    </header>
  );
}
