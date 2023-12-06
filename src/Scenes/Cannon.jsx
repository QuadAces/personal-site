import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import useWindowDimensions from "../Hooks/windowDimentions"

export default function Cannon({position}) {
    const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cannon-large/model.gltf')
    position[2] = position[2] + 1.25
    const yRef = useRef()
    const xRef = useRef()

    const [
        mousePosition,
        setMousePosition
      ] = useState({ x: null, y: null });
      useEffect(() => {
        const updateMousePosition = ev => {
          setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
          window.removeEventListener('mousemove', updateMousePosition);
        };
      }, []);
      const {height, width} = useWindowDimensions()

      

    useFrame((state,delta) => {
        //Height
        //height mouse (top)
        
        yRef.current.rotation.x = -1.5 * mousePosition.y / height + Math.PI / 3
        xRef

    })
    return <group position={position} scale={[3,3,3]} ref={xRef}>
        {/* Wood */}
<mesh geometry={nodes.cannonLarge_1.geometry} material={materials['wood.005']} />
{/* Connector Thing */}
<mesh geometry={nodes.cannonLarge_2.geometry} material={nodes.cannonLarge_2.material} />
{/* Actual cannon */}
<mesh ref={yRef} geometry={nodes.barrel_1.geometry} material={nodes.barrel_1.material} position={[0, 0.35, -0.07,]} />
</group>
}

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cannon-large/model.gltf')
