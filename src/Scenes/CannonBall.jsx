import { useRef, useEffect } from "react"
import { Html } from "@react-three/drei"
import { RigidBody, } from "@react-three/rapier"
import useWindowDimensions from "../Hooks/windowDimentions"

export default function CannonBall({ mouseX, mouseY, ballPosition })
{
    const ballRef = useRef()

    useEffect(() =>
    {
        requestAnimationFrame(() =>
        {

          applyImpulse(mouseX, mouseY)
        })
    }, [])

    const { height, width } = useWindowDimensions()

    function applyImpulse(mouseX, mouseY)
    {   
        console.log(mouseX)
        console.log((mouseX - width / 2))
        ballRef.current.applyImpulse(
            { x: (mouseX - width / 2) / 10, y: (height /2 - mouseY ) / 10, z: -10 }
        )
    }

    return (
        <>
            
            <RigidBody
        position={ballPosition}
                ref={ballRef}
                name={Math.random()}
                colliders={"ball"}
                mass={2}
                restitution={0.2}
                friction={10}
                linearDamping={1}
                angularDamping={1}
            >
                <mesh castShadow scale={[0.5,0.5,0.5]}>
                    <sphereGeometry onClick={applyImpulse} />
                    <meshNormalMaterial color="orange" />
                </mesh>
            </RigidBody>

        </>
    )
}
