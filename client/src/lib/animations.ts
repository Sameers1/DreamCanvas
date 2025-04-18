import { MotionProps } from "framer-motion";

export const dreamFadeIn: MotionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeInOut" },
};

export const dreamFadeInDelayed: MotionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeInOut", delay: 0.2 },
};

export const dreamScaleIn: MotionProps = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const dreamHoverCard = {
  whileHover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(107, 70, 193, 0.4)",
    transition: { duration: 0.3, ease: "easeOut" } 
  },
};
