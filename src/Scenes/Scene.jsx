import Target from "./targets";
import { PerspectiveCamera } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
import { Stage} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Cannon from "./Cannon";
import CannonBall from "./CannonBall";
import { Physics, RigidBody } from "@react-three/rapier";
import {useState, useEffect} from 'react'
import { generateUUID } from "three/src/math/MathUtils";
export default function Scene({trigger, cameraPosition}) {
 
  

cameraPosition = [0,0,0]
const cannonPosition = [0,-0.75,-0.25]
const ballPosition = cameraPosition
const targetsPosition = [0,3,-6]
const targetWidth = 4
//target spin on the Z axis
const targetSpin = Math.PI * 1.7
const targetsHeightDiff = 0.5
  const [cannonBalls, setCannonBalls] = useState([])
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Function to update the cannon balls with the ref properties
    const updateCannonBalls = () => {
      setCannonBalls((prevBalls) => [
        ...prevBalls,
        <CannonBall
          key={cannonBalls.length + 1}
          mouseX={mousePositionRef.current.x}
          mouseY={mousePositionRef.current.y}
          position={ballPosition}
        ></CannonBall>,
      ]);
    };

    // Update cannon balls once on mount
    updateCannonBalls();

    // Function to update the ref properties on mouse movement
    const updateMousePosition = (ev) => {
      mousePositionRef.current = { x: ev.clientX, y: ev.clientY };
    };

    // Add event listener for mouse movement
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [trigger]);

    return <>

    <Perf></Perf>
    <color attach={"background"} args={[0, 0, 0]}></color>
    <Suspense fallback={null}>
     
        <Physics debug gravity={[0, -9.81, 0]}>
          <Target position={targetsPosition} targetsWidth={targetWidth} targetsHeightDiff={targetsHeightDiff} targetSpin={targetSpin}></Target>
        <ambientLight intensity={5} position={[1, 1, 1]}></ambientLight>
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur></Bloom>
        </EffectComposer>
        {...cannonBalls}

        </Physics>
        <Cannon position={cannonPosition}></Cannon>
      </Suspense>

    </>

 }