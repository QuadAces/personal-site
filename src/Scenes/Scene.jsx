import Target from "./targets";
import { PerspectiveCamera } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import { Stage} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Cannon from "./Cannon";
import CannonBall from "./CannonBall";
import { Physics, RigidBody } from "@react-three/rapier";
import {useState, useEffect} from 'react'
import { generateUUID } from "three/src/math/MathUtils";
export default function Scene({trigger}) {
  const [
    mousePosition,
    setMousePosition
  ] = useState({ x: null, y: null });
  

  useEffect(()=> {
    setCannonBalls((e) => {
      
      return [...e, <CannonBall position={cameraPosition} key={Math.random()} mouseX={mousePosition.y} mouseY={mousePosition.y} ></CannonBall>]
    })
    const updateMousePosition = ev => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };

  }, [trigger])

const [cannonBalls, setCannonBalls] = useState([])


    const cameraPosition = [0,0,15]
    return <>
    <PerspectiveCamera makeDefault position={cameraPosition}  ></PerspectiveCamera>

    <Perf></Perf>
    <color attach={"background"} args={[0, 0, 0]}></color>
    <Suspense fallback={null}>
      <Stage
        // preset="rembrandt"
        // intensity={1}
        // environment="city"
        >
        <Physics debug gravity={[0, -9.81, 0]}>
        <ambientLight intensity={5} position={[1, 1, 1]}></ambientLight>
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur></Bloom>
        </EffectComposer>
{...cannonBalls}
{/* <Target></Target> */}

<RigidBody type="fixed">
<mesh receiveShadow color={['red']}>
                <boxGeometry args={[3, 1, 3]} />
                <meshStandardMaterial color="#E57CD8" />
            </mesh>
</RigidBody>
<CannonBall mouseX={mousePosition.x} mouseY={mousePosition.y}>

</CannonBall >
{/* <Cannon position={cameraPosition}></Cannon> */}
</Physics>
        </Stage>
      </Suspense>

    </>

 }