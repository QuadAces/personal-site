import Target from "./targets";
import { PerspectiveCamera } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import { Stage} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Cannon from "./Cannon";
export default function Scene() {
    const cameraPosition = [0,0,8]
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
        <ambientLight intensity={5} position={[1, 1, 1]}></ambientLight>
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur></Bloom>
        </EffectComposer>
<Target></Target>
<Cannon position={cameraPosition}></Cannon>
        </Stage>
      </Suspense>

    </>

 }