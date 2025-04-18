import { motion } from "framer-motion";

interface BubbleProps {
  size: number;
  top: string;
  left: string;
  delay: number;
}

const Bubble = ({ size, top, left, delay }: BubbleProps) => {
  return (
    <motion.div
      className="dream-bubble absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        background: "linear-gradient(45deg, rgba(107, 70, 193, 0.2), rgba(159, 122, 234, 0.1))",
        opacity: 0.3,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
};

export function BubbleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <Bubble size={300} top="10%" left="5%" delay={0} />
      <Bubble size={200} top="40%" left="90%" delay={2} />
      <Bubble size={150} top="70%" left="20%" delay={4} />
      <Bubble size={180} top="85%" left="75%" delay={6} />
    </div>
  );
}
