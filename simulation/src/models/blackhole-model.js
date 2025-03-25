import React, { useRef } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'

export function BlackholeModel(props) {
  const { nodes, materials } = useGLTF('/models/blackhole-final.glb')
  return (
    <group {...props} dispose={null}>
      <pointLight
        intensity={54351.413}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <PerspectiveCamera
        makeDefault={false}
        far={100}
        near={0.1}
        fov={22.895}
        position={[23.932, 11.935, 6.926]}
        rotation={[-0.627, 0.71, 0.441]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk.geometry}
        material={materials.Accretion_Disk_inner}
        position={[-15.971, 0, -7.861]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk001.geometry}
        material={materials.Accretion_Disk_inner}
        position={[-15.971, 0, -7.861]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk002.geometry}
        material={materials.Accretion_Disk_inner}
        position={[-15.971, 0, -7.861]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk003.geometry}
        material={materials.Accretion_Disk_inner}
        position={[-15.971, 0, -7.861]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk004.geometry}
        material={materials.Accretion_Disk_inner}
        position={[-15.971, 0, -7.861]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk005.geometry}
        material={materials.Accretion_Disk_outer}
        position={[-15.971, 0, -7.861]}
        rotation={[0, 0.3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk_extra_01.geometry}
        material={materials.Accretion_Disk_extra_02}
        position={[-15.971, 0, -7.861]}
        rotation={[0, 0.3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.accretion_disk_extra_02.geometry}
        material={materials.Accretion_Disk_extra}
        position={[-15.971, 0, -7.861]}
        rotation={[0, 0.3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Event_Horizon.geometry}
        material={materials.Black_Hole}
        position={[-15.971, 0, -7.861]}
      />
    </group>
  )
}

useGLTF.preload('/models/blackhole-final.glb')
