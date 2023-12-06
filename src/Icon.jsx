import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Diamond from "./Diamond";
export default function Icon() {
  const ref = useRef();
  const diamond = useRef()

  return (
    <Canvas >
        <camera lookAt={diamond}>

        </camera>
        <color args={['#000000']} attach={'background'}></color>
      <Suspense fallback={null} environment="night">
        <Stage shadows={false} environment={"park"}>
              <Diamond ref={diamond}/>
          <ambientLight intensity={5} position={[1, 1, 1]}></ambientLight>
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0}
              mipmapBlur
            />
          </EffectComposer>

        </Stage>
      </Suspense>
      <OrbitControls ref={ref}  />
    </Canvas>
  );
}
