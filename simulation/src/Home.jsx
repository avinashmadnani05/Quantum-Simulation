// import React, { useRef, useEffect } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stars } from "@react-three/drei";
// import * as THREE from "three";

// const BlackHoleShader = {
//   uniforms: {
//     uTime: { value: 0 },
//     uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
//   },
//   vertexShader: `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   fragmentShader: `
//     varying vec2 vUv;
//     uniform float uTime;

//     void main() {
//       vec2 uv = vUv - 0.5; // Center UV coordinates
//       uv.x *= 1.5; // Correct aspect ratio distortion
//       float len = length(uv);

//       // Gravitational lensing effect
//       float lens = 0.1 / (len + 0.1);
//       float swirl = 0.5 + 0.5 * sin(uTime * 0.5 + len * 15.0);

//       // Accretion disk simulation
//       vec3 color = vec3(0.0);
//       color.r = smoothstep(0.02, 0.05, lens) * swirl * 2.0; // Heat radiation
//       color.g = smoothstep(0.02, 0.1, lens) * swirl * 0.5;
//       color.b = smoothstep(0.05, 0.15, lens) * swirl * 0.3;

//       // Event horizon (dark center)
//       float eventHorizon = smoothstep(0.0, 0.05, len);
//       color *= 1.0 - eventHorizon;

//       gl_FragColor = vec4(color, 1.0);
//     }
//   `,
// };

// function BlackHole() {
//   const shaderRef = useRef();

//   useEffect(() => {
//     const updateShaderTime = () => {
//       if (shaderRef.current) {
//         shaderRef.current.material.uniforms.uTime.value += 0.02;
//       }
//       requestAnimationFrame(updateShaderTime);
//     };
//     updateShaderTime();
//   }, []);

//   return (
//     <mesh ref={shaderRef}>
//       <planeGeometry args={[5, 5, 64, 64]} />
//       <shaderMaterial
//         attach="material"
//         args={[BlackHoleShader]}
//         uniforms={BlackHoleShader.uniforms}
//         vertexShader={BlackHoleShader.vertexShader}
//         fragmentShader={BlackHoleShader.fragmentShader}
//         side={THREE.DoubleSide}
//       />
//     </mesh>
//   );
// }

// function AccretionDisk() {
//   return (
//     <mesh rotation-x={Math.PI / 2}>
//       <torusGeometry args={[1.5, 0.2, 128, 256]} />
//       <meshStandardMaterial
//         color="#FFA500"
//         emissive="#FF4500"
//         emissiveIntensity={3}
//         metalness={0.8}
//         roughness={0.2}
//         opacity={0.9}
//         transparent={true}
//       />
//     </mesh>
//   );
// }

// function EventHorizon() {
//   return (
//     <mesh>
//       <sphereGeometry args={[1, 64, 64]} />
//       <meshStandardMaterial color="#000000" />
//     </mesh>
//   );
// }

// function CosmicBackground() {
//   return <Stars radius={100} depth={50} count={5000} factor={5} saturation={0} fade />;
// }

// function Home() {
//   return (
//     <div style={{ width: "100vw", height: "100vh", background: "black" }}>
//       <Canvas camera={{ position: [0, 0, 7], fov: 75 }}>
//         {/* Lighting */}
//         <ambientLight intensity={0.2} />
//         <pointLight position={[10, 10, 10]} intensity={3} />

//         {/* Black Hole */}
//         <EventHorizon />
//         <AccretionDisk />
//         <BlackHole />

//         {/* Cosmic Background */}
//         <CosmicBackground />

//         {/* Controls */}
//         <OrbitControls enableZoom={true} />
//       </Canvas>
//     </div>
//   );
// }

// export default Home;









import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Html } from '@react-three/drei';
import React, { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three'; // Import THREE for animations
import { useFrame } from '@react-three/fiber';

function BlackHoleModel() {
  const { scene, animations } = useGLTF('/models/untitled-final.glb'); // Use absolute path
  const mixer = useRef();

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => mixer.current.clipAction(clip).play());
    }
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  return <primitive object={scene} position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} />;
}

function CosmicBackground() {
  return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />;
}

function Home() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[0, 5, 5]} angle={0.15} penumbra={1} castShadow />

        <CosmicBackground />

        <Suspense fallback={<Html><div>Loading...</div></Html>}>
          <BlackHoleModel />
        </Suspense>

        <OrbitControls enableZoom={true} />
      </Canvas>
    </>
  );
}

export default Home;