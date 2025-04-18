import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BubbleProps {
  size: number;
  top: string;
  left: string;
  delay: number;
  color: string;
  blurAmount: number;
}

const Bubble = ({ size, top, left, delay, color, blurAmount }: BubbleProps) => {
  return (
    <motion.div
      className="dream-bubble absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        background: color,
        opacity: 0.3,
        filter: `blur(${blurAmount}px)`,
        backdropFilter: "blur(2px)",
      }}
      animate={{
        y: [0, -40, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 10, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 12,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
        repeatType: "reverse",
      }}
    />
  );
};

// Sparkle component for small twinkling stars
const Sparkle = ({ top, left, size, delay }: { top: string; left: string; size: number; delay: number }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
      }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
};

// Comet component for shooting stars
const Comet = ({ top, left, angle }: { top: string; left: string; angle: number }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top,
        left,
        width: "100px",
        height: "2px",
        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
        borderRadius: "4px",
        transformOrigin: "left center",
        transform: `rotate(${angle}deg)`,
      }}
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 500, opacity: [0, 1, 0] }}
      transition={{
        duration: 2,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 15 + 10, // Random delay between 10-25 seconds
      }}
    />
  );
};

export function BubbleBackground() {
  const [sparkles, setSparkles] = useState<JSX.Element[]>([]);
  const [comets, setComets] = useState<JSX.Element[]>([]);
  
  // Generate sparkles on component mount
  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }, (_, i) => (
      <Sparkle
        key={`sparkle-${i}`}
        top={`${Math.random() * 100}%`}
        left={`${Math.random() * 100}%`}
        size={Math.random() * 3 + 1}
        delay={Math.random() * 5}
      />
    ));
    
    const newComets = Array.from({ length: 3 }, (_, i) => (
      <Comet
        key={`comet-${i}`}
        top={`${Math.random() * 50}%`}
        left={`${Math.random() * 80}%`}
        angle={Math.random() * 30 - 15}
      />
    ));
    
    setSparkles(newSparkles);
    setComets(newComets);
  }, []);

  // Bubble colors with gradients
  const bubbleColors = [
    "radial-gradient(circle, rgba(107, 70, 193, 0.4) 0%, rgba(107, 70, 193, 0.1) 70%)",
    "radial-gradient(circle, rgba(159, 122, 234, 0.3) 0%, rgba(159, 122, 234, 0.1) 70%)",
    "radial-gradient(circle, rgba(118, 228, 247, 0.3) 0%, rgba(118, 228, 247, 0.05) 70%)",
    "radial-gradient(circle, rgba(255, 99, 195, 0.3) 0%, rgba(255, 99, 195, 0.05) 70%)",
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large dreamy bubbles */}
      <Bubble size={350} top="5%" left="3%" delay={0} color={bubbleColors[0]} blurAmount={20} />
      <Bubble size={250} top="30%" left="85%" delay={3} color={bubbleColors[1]} blurAmount={15} />
      <Bubble size={180} top="65%" left="10%" delay={6} color={bubbleColors[2]} blurAmount={25} />
      <Bubble size={220} top="80%" left="70%" delay={9} color={bubbleColors[3]} blurAmount={20} />
      <Bubble size={120} top="20%" left="50%" delay={4.5} color={bubbleColors[0]} blurAmount={10} />
      <Bubble size={200} top="50%" left="30%" delay={7.5} color={bubbleColors[1]} blurAmount={18} />
      
      {/* Twinkling stars */}
      {sparkles}
      
      {/* Shooting stars */}
      {comets}
      
      {/* Subtle haze overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(15, 10, 41, 0.4) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
