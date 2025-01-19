// 3d model realstic of Black Hole
// Black Hole .jsx
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const BlackHole = () => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/blackhole/scene.gltf");

  return (
    <Canvas>
      <group ref={group} dispose={null}>
        <mesh geometry={nodes.BlackHole.geometry} material={materials.BlackHole} />
      </group>
    </Canvas>
  );
};

useGLTF.preload("/blackhole/scene.gltf");

export default BlackHole;












