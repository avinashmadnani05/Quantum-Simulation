// import React, { useEffect, useRef } from 'react'
// import { Canvas, useThree, useFrame } from '@react-three/fiber'
// import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import * as THREE from 'three'
// import { SolarSystem } from './models/solar-sytem'
// import { Model as BlackHoleModel } from './models/model'
// import './home.css'
// import { Link } from 'react-router-dom'
// import Simulation from './Simulation.jsx'
// // import { BlackholeModel } from './models/blackhole-model.js'
// gsap.registerPlugin(ScrollTrigger)

// const EARTH_POSITION = new THREE.Vector3(0.2, 0.2, 16.9)
// const BLACK_HOLE_POSITION = new THREE.Vector3(12.20890,26.65175,163.011558)
// const BLACK_HOLE_CENTER = new THREE.Vector3(
//   BLACK_HOLE_POSITION.x, 
//   BLACK_HOLE_POSITION.y, 
//   BLACK_HOLE_POSITION.z
// );
// function CameraScrollAnimation() {
//   const { camera } = useThree();
//   const timeline = useRef();
//   const blackHoleCenter = useRef(new THREE.Vector3());

//   useEffect(() => {
//     document.body.style.height = '400vh';
//     blackHoleCenter.current.copy(BLACK_HOLE_POSITION);

//     timeline.current = gsap.timeline({
//       scrollTrigger: {
//         trigger: document.body,
//         start: 'top top',
//         end: '+=400%',
//         scrub: 1,
//         markers: true
//       }
//     });

//     // Initial Earth close-up
//     timeline.current.set(camera.position, {
//       x: EARTH_POSITION.x,
//       y: EARTH_POSITION.y,
//       z: EARTH_POSITION.z
//     });

//     // Step 1: Pull back from Earth
//     timeline.current.to(camera.position, {
//       z: EARTH_POSITION.z + 40,
//       duration: 2,
//       ease: "power2.inOut",
//       onUpdate: () => camera.lookAt(EARTH_POSITION)
//     }, 0);

//     // Step 2: Solar system view
//     timeline.current.to(camera.position, {
//       x: EARTH_POSITION.x+20,
//       y: EARTH_POSITION.y,
//       z: EARTH_POSITION.z+40,
//       duration: 3,
//       ease: "power2.Out",
//       onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
//     }, 0.8);

//     // Step 3: Full solar system view
//     timeline.current.to(camera.position, {
//       y: 50,
//       z: 205,
//       duration: 2,
//       ease: "power1.out",
//       onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
//     },1.5);

   
//    // Black hole approach
//    timeline.current.to(
//     camera.position,
//     {
//       x: BLACK_HOLE_POSITION.x,
//       y: BLACK_HOLE_POSITION.y,
//       z: BLACK_HOLE_POSITION.z , // offset so the black hole is visible in front of the camera
//       duration: 3,
//       ease: 'power4.inOut',
//       onUpdate: () => camera.lookAt(BLACK_HOLE_POSITION)
//     },
//     4.5
//   )
    

//     // Final zoom into black hole
//     timeline.current.to(camera.position, {
//       x: BLACK_HOLE_POSITION.x,
//       y: BLACK_HOLE_POSITION.y,
//       z: BLACK_HOLE_POSITION.z ,
//       duration: 1.5,
//       ease: 'power4.in',
//       onComplete: () => {
//         window.location.href = "";
//       }
//     }, 6);

//     return () => timeline.current.kill();
//   }, [camera]);

//   return null;

// }





// function Home() {
//   return (
//     <>
//       <Canvas>
//         <PerspectiveCamera makeDefault position={[0.2, 0.8, 14.6]} fov={75} />
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <Stars radius={300} depth={50} count={5000} factor={4} fade />
        
//         <React.Suspense fallback={<Html><div>Loading...</div></Html>}>
//           <SolarSystem position={[0, 0, 0]} />
//           {/* <RotatingBlackHole 
//             position={BLACK_HOLE_POSITION}
//             scale={10}
//           /> */}
//           <BlackHoleModel position={BLACK_HOLE_POSITION} scale={4}
//           />
//         </React.Suspense>


//         <OrbitControls enabled={false} />

//         <CameraScrollAnimation />
        
//         {/* <RaycastClick /> */}
//       </Canvas>
//       {/* Move Button outside the Canvas */}
//       <div className="ui-overlay">
//         <button onClick={() => window.location.href = '/'}>Go to Simulation</button>
//       </div>
//     </>
//   );
// }

// export default Home;
import React, { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { SolarSystem } from './models/solar-sytem'
import { Model as BlackHoleModel } from './models/model'
import './home.css'
import { Link } from 'react-router-dom'
import Simulation from './Simulation.jsx'

gsap.registerPlugin(ScrollTrigger)

const EARTH_POSITION = new THREE.Vector3(0.2, 0.2, 16.9)
// Adjusted black hole position as needed
const BLACK_HOLE_POSITION = new THREE.Vector3(12.20890, 26.65175, 163.011558)

function CameraScrollAnimation() {
  const { camera } = useThree()
  const timeline = useRef()


    useEffect(() => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.height = '400%'
      }  
      timeline.current = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          markers: true,
          pin: true
        }
      })
      timeline.current.set(camera.position, EARTH_POSITION)

    // Start: Earth close-up
    timeline.current.set(camera.position, {
      x: EARTH_POSITION.x,
      y: EARTH_POSITION.y,
      z: EARTH_POSITION.z
    })

    // Step 1: Pull back from Earth
    timeline.current.to(
      camera.position,
      {
        z: EARTH_POSITION.z + 40,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(EARTH_POSITION)
      },
      0
    )

    // Step 2: Solar system view
    timeline.current.to(
      camera.position,
      {
        x: EARTH_POSITION.x + 20,
        y: EARTH_POSITION.y,
        z: EARTH_POSITION.z + 40,
        duration: 3,
        ease: 'power2.out',
        onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
      },
      0.8
    )

    // Step 3: Full solar system view
    timeline.current.to(
      camera.position,
      {
        y: 50,
        z: 205,
        duration: 2,
        ease: 'power1.out',
        onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
      },
      1.5
    )

    // Step 4: Approach black hole
    timeline.current.to(
      camera.position,
      {
        ...BLACK_HOLE_POSITION,
        z: BLACK_HOLE_POSITION.z + 40,  // Start further back
        duration: 3,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(BLACK_HOLE_POSITION)
      },
      4.5
    )

    // Step 5: Zoom into black hole center
    timeline.current.to(
      camera.position,
      {
        ...BLACK_HOLE_POSITION,
        duration: 2.5,
        ease: 'power4.in',
        onUpdate: () => camera.lookAt(BLACK_HOLE_POSITION),
        onComplete: () => {
          window.location.href = "/simulation" // Your target URL
        }
      },
      7.5
    )

    return () => timeline.current.kill()
  }, [camera])

  return null
}

function Home() {
  return (
    <>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0.2, 0.8, 14.6]} fov={75} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={300} depth={50} count={5000} factor={4} fade />

        <React.Suspense fallback={<Html><div>Loading...</div></Html>}>
          <SolarSystem position={[0, 0, 0]} />
          <BlackHoleModel position={BLACK_HOLE_POSITION} scale={4} />
        </React.Suspense>

        <OrbitControls enabled={false} />
        <CameraScrollAnimation />
      </Canvas>


    </>
  )
}

export default Home
