import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpaceObjectProps {
  type: 'planet' | 'star' | 'comet' | 'asteroid' | 'spaceship';
  size: number;
  x: number;
  y: number;
  z: number;
  rotationSpeed?: number;
  color?: string;
}

const SpaceObject = ({ type, size, x, y, z, rotationSpeed = 0, color }: SpaceObjectProps) => {
  // Calculate opacity based on z position
  const opacity = Math.max(0.2, Math.min(1, (1000 - z) / 1000));
  
  // Calculate scale based on z position (perspective effect)
  const scale = Math.max(0.1, Math.min(1, (1000 - z) / 1000));
  
  // Get appropriate JSX based on object type
  const getObjectJSX = () => {
    switch (type) {
      case 'planet':
        return (
          <motion.div
            className="rounded-full absolute"
            style={{
              width: size * scale,
              height: size * scale,
              left: `${x}%`,
              top: `${y}%`,
              zIndex: Math.floor(1000 - z),
              opacity,
              background: color || `radial-gradient(circle, rgba(118,228,247,1) 0%, rgba(107,70,193,1) 100%)`,
              boxShadow: '0 0 20px rgba(118,228,247,0.5)'
            }}
            animate={{
              rotate: 360,
              scale: [scale, scale * 1.05, scale]
            }}
            transition={{
              rotate: {
                duration: rotationSpeed || 20,
                repeat: Infinity,
                ease: 'linear'
              },
              scale: {
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
          >
            {/* Planet rings for larger planets */}
            {size > 40 && (
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: size * scale * 1.5,
                  height: (size * scale) / 4,
                  borderRadius: '50%',
                  border: `2px solid rgba(255,255,255,0.3)`,
                  transform: 'rotate(30deg) translate(-50%, -50%)'
                }}
              />
            )}
          </motion.div>
        );
        
      case 'star':
        return (
          <motion.div
            className="absolute"
            style={{
              width: size * scale,
              height: size * scale,
              left: `${x}%`,
              top: `${y}%`,
              zIndex: Math.floor(1000 - z),
            }}
            animate={{
              opacity: [opacity, opacity * 0.5, opacity]
            }}
            transition={{
              opacity: {
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" 
                fill="white" 
                opacity={opacity}
              />
            </svg>
          </motion.div>
        );
        
      case 'comet':
        return (
          <motion.div
            className="absolute"
            style={{
              width: size * 3 * scale,
              height: size / 4 * scale,
              left: `${x}%`,
              top: `${y}%`,
              zIndex: Math.floor(1000 - z),
              transform: `rotate(${45 + Math.random() * 20}deg)`,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.9) 70%, rgba(159,122,234,0.8) 100%)',
              borderRadius: '100px'
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: 500, 
              opacity: [0, opacity, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 5 + Math.random() * 15,
              ease: 'easeOut'
            }}
          />
        );
        
      case 'spaceship':
        return (
          <motion.div
            className="absolute"
            style={{
              width: size * scale,
              height: size / 2 * scale,
              left: `${x}%`,
              top: `${y}%`,
              zIndex: Math.floor(1000 - z),
              opacity
            }}
            animate={{
              x: [0, 10, -5, 0],
              y: [0, -5, 5, 0],
              rotate: [0, 5, -3, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25L40 10H70L90 25L70 40H40L10 25Z" fill="#9F7AEA" />
              <circle cx="50" cy="25" r="8" fill="#76E4F7" />
              <path d="M90 25L95 20L95 30L90 25Z" fill="#FF63C3" />
              {/* Engine glow */}
              <motion.path 
                d="M10 25L0 22L0 28L10 25Z" 
                fill="#FF63C3" 
                animate={{ 
                  opacity: [1, 0.5, 1],
                  fill: ['#FF63C3', '#76E4F7', '#FF63C3'] 
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </svg>
            
            {/* Engine particles */}
            <motion.div
              className="absolute right-full top-1/2 -translate-y-1/2"
              animate={{
                opacity: [0, 0.7, 0],
                x: [-5, -20]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeOut'
              }}
              style={{
                width: size * 0.3 * scale,
                height: size * 0.1 * scale,
                background: 'linear-gradient(90deg, rgba(255,99,195,0) 0%, rgba(118,228,247,1) 100%)',
                borderRadius: '50%'
              }}
            />
          </motion.div>
        );
        
      case 'asteroid':
      default:
        return (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size * scale,
              height: size * scale,
              left: `${x}%`,
              top: `${y}%`,
              zIndex: Math.floor(1000 - z),
              opacity,
              backgroundImage: 'radial-gradient(circle, rgba(45,55,72,1) 0%, rgba(26,32,44,1) 100%)'
            }}
            animate={{
              rotate: 360
            }}
            transition={{
              duration: rotationSpeed || 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        );
    }
  };
  
  return getObjectJSX();
};

// Main component
export function SpaceScene() {
  const [spaceObjects, setSpaceObjects] = useState<SpaceObjectProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Generate random space objects
    const objects: SpaceObjectProps[] = [];
    
    // Add stars (many small ones)
    for (let i = 0; i < 20; i++) {
      objects.push({
        type: 'star',
        size: 4 + Math.random() * 8,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 500,
      });
    }
    
    // Add planets (a few larger ones)
    for (let i = 0; i < 3; i++) {
      const planetColors = [
        'radial-gradient(circle, rgba(118,228,247,1) 0%, rgba(107,70,193,1) 100%)',
        'radial-gradient(circle, rgba(255,99,195,1) 0%, rgba(107,70,193,1) 100%)',
        'radial-gradient(circle, rgba(245,158,11,1) 0%, rgba(192,38,211,1) 100%)'
      ];
      
      objects.push({
        type: 'planet',
        size: 30 + Math.random() * 40,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        z: 300 + Math.random() * 600,
        rotationSpeed: 30 + Math.random() * 50,
        color: planetColors[i % planetColors.length]
      });
    }
    
    // Add comets
    for (let i = 0; i < 5; i++) {
      objects.push({
        type: 'comet',
        size: 5 + Math.random() * 10,
        x: Math.random() * 80,
        y: Math.random() * 80,
        z: Math.random() * 800,
      });
    }
    
    // Add a spaceship
    objects.push({
      type: 'spaceship',
      size: 60,
      x: 75,
      y: 30,
      z: 400,
    });
    
    // Add asteroids
    for (let i = 0; i < 8; i++) {
      objects.push({
        type: 'asteroid',
        size: 5 + Math.random() * 15,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: 200 + Math.random() * 700,
        rotationSpeed: 10 + Math.random() * 20
      });
    }
    
    setSpaceObjects(objects);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center',
      }}
    >
      <div className="relative w-full h-full">
        {spaceObjects.map((obj, index) => (
          <SpaceObject key={`space-obj-${index}`} {...obj} />
        ))}
      </div>
      
      {/* Add a subtle nebula/fog effect */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          background: 'radial-gradient(ellipse at center, rgba(107,70,193,0.1) 0%, rgba(15,10,41,0) 70%)',
          filter: 'blur(30px)',
          transform: 'translateZ(-10px)',
        }}
      />
    </div>
  );
}