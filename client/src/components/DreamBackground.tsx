import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface DreamObjectData {
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
}

const DreamBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create dream-like objects
    const createDreamObject = () => {
      const geometry = new THREE.IcosahedronGeometry(1, 0);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(Math.random() * 0xffffff),
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        specular: new THREE.Color(0xffffff),
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      // Random rotation speed
      mesh.userData = {
        rotationSpeed: {
          x: Math.random() * 0.02,
          y: Math.random() * 0.02,
          z: Math.random() * 0.02
        }
      } as DreamObjectData;
      
      return mesh;
    };

    // Create multiple dream objects
    const dreamObjects: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const object = createDreamObject();
      scene.add(object);
      dreamObjects.push(object);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Add point lights
    const pointLight1 = new THREE.PointLight(0x4dabf7, 2, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xda77f2, 2, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Add fog
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // Camera position
    camera.position.z = 15;

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate dream objects
      dreamObjects.forEach(object => {
        const data = object.userData as DreamObjectData;
        object.rotation.x += data.rotationSpeed.x;
        object.rotation.y += data.rotationSpeed.y;
        object.rotation.z += data.rotationSpeed.z;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material: THREE.Material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

export default DreamBackground; 