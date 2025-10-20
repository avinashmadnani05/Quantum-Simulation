import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DynamicEventHorizon = ({ mass = 10, radius = 1, timeDilation = 1, color = [1.0, 0.6, 0.2] }) => {
  const sphereRef = useRef();
  const diskRef = useRef();
  const glowRef = useRef();
  const gridRef = useRef();
  const { camera, gl } = useThree();

  // Adaptive geometry detail: reduce segments on lower DPR for performance
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const segments = useMemo(() => (dpr > 1.5 ? 64 : 32), [dpr]);

  // Physical material for the event horizon body with emissive rim
  const sphereMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissiveIntensity: 1.5,
      emissive: new THREE.Color(color[0] * 0.08, color[1] * 0.05, color[2] * 0.02)
    });

    // Inject a subtle rim effect into the shader (onBeforeCompile - safe and performant)
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uRimPower = { value: 2.0 + Math.log10(Math.max(mass, 1)) };
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
         // Rim lighting
         float rim = 1.0 - max(0.0, dot(normalize(vNormal), normalize(-viewPosition)));
         rim = pow(rim, shader.uniforms.uRimPower.value);
         diffuseColor.rgb += vec3(${color[0].toFixed(3)}, ${color[1].toFixed(3)}, ${color[2].toFixed(3)}) * rim * 0.6;
        `
      );
    };

    return mat;
  }, [color, mass]);

  // Accretion disk shader material (fast, with rotation)
  const diskMaterial = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uInner: { value: radius * 1.4 },
      uOuter: { value: radius * 4.0 },
      uColor: { value: new THREE.Vector3(color[0], color[1] * 0.6, color[2] * 0.3) }
    };

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uInner;
        uniform float uOuter;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vPos;

        void main() {
          float r = length(vPos.xz);
          float t = uTime * 0.7;
          float normalized = smoothstep(uOuter, uInner, r);
          float waves = sin(10.0 * r - t * 3.0) * 0.5 + 0.5;
          float intensity = normalized * waves;
          vec3 col = mix(vec3(0.02,0.02,0.02), uColor, intensity);
          float alpha = intensity * 0.9;
          // Add subtle radial falloff
          alpha *= smoothstep(uOuter, uOuter * 0.95, r);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, [radius, color]);

  // Soft glow sprite behind the horizon
  useEffect(() => {
    if (!gl) return;
    // preload a small circle texture or create one procedurally if needed
  }, [gl]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Rotate the accretion disk
    if (diskRef.current) diskRef.current.rotation.z = t * 0.6 * (1 + Math.log10(Math.max(mass, 1)) * 0.1);

    // Slight pulsation based on time dilation
    if (sphereRef.current) {
      const scale = 1 + Math.min(0.4, timeDilation * 0.02) * Math.sin(t * 0.8);
      sphereRef.current.scale.setScalar(scale);
    }

    // update disk shader time uniform
    if (diskRef.current && diskRef.current.material && diskRef.current.material.uniforms) {
      diskRef.current.material.uniforms.uTime.value = t;
    }
  });

  return (
    <group>
      {/* Event Horizon Sphere */}
      <mesh ref={sphereRef} material={sphereMaterial} position={[0, 0, 0]}>
        <sphereGeometry args={[radius, segments, segments]} />
      </mesh>

      {/* Accretion Disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[radius * 1.4, radius * 4.5, 128, 1]} />
        <primitive object={diskMaterial} attach="material" />
      </mesh>

      {/* Soft Glow (sprite) */}
      <mesh ref={glowRef} position={[0, 0, -0.2]}>
        <planeGeometry args={[radius * 6, radius * 6]} />
        <meshBasicMaterial color={new THREE.Color(color[0] * 0.6, color[1] * 0.3, color[2] * 0.2)} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Spacetime Grid (subtle) */}
      <mesh ref={gridRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -radius * 1.8, 0]}>
        <planeGeometry args={[40, 40, 32, 32]} />
        <meshStandardMaterial color="#0b1220" metalness={0.1} roughness={0.9} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

export default DynamicEventHorizon;
