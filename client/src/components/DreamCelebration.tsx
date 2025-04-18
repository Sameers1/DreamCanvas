import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface DreamCelebrationProps {
  isVisible: boolean;
  position: { x: number; y: number };
}

const DreamCelebration: React.FC<DreamCelebrationProps> = ({ isVisible, position }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (!mountRef.current || !isVisible) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    // Create celebration particles
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Start from center
      initialPositions[i * 3] = 0;
      initialPositions[i * 3 + 1] = 0;
      initialPositions[i * 3 + 2] = 0;

      // Random colors (dreamy colors)
      const hue = Math.random() * 0.3 + 0.6; // Purple to blue range
      color.setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random sizes
      sizes[i] = Math.random() * 0.3 + 0.1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create particle system
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Camera position
    camera.position.z = 5;

    // Create animation timeline
    animationRef.current = gsap.timeline({
      onComplete: () => {
        // Reset particles to center
        const particlePositions = particleSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particlePositions.length; i += 3) {
          particlePositions[i] = 0;
          particlePositions[i + 1] = 0;
          particlePositions[i + 2] = 0;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }
    });

    // Animate particles outward
    const particlePositions = particleSystem.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particlePositions.length; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3 + 2;
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius;
      const targetZ = (Math.random() - 0.5) * 2;

      animationRef.current.to(
        particlePositions,
        {
          [i]: targetX,
          [i + 1]: targetY,
          [i + 2]: targetZ,
          duration: 1,
          ease: "power2.out",
        },
        0
      );
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      scene.remove(particleSystem);
      particles.dispose();
      particleMaterial.dispose();
      animationRef.current?.kill();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={mountRef}
      className="fixed pointer-events-none z-20"
      style={{
        left: position.x - 150,
        top: position.y - 150,
        width: 300,
        height: 300,
      }}
    />
  );
};

export default DreamCelebration; 