import { useRef, useEffect } from "react"
import { Html } from "@react-three/drei"
import { RigidBody, } from "@react-three/rapier"
import useWindowDimensions from "../Hooks/windowDimentions"

export default function CannonBall({ mouseX, mouseY, position, scale, targetsPosition,targetWidth })
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
        console.log((width))
        console.log(((0.5 * width - mouseX) / width))
        ballRef.current.applyImpulse(
            // { x: (mouseX - width / 2) / 10, y: (height /2 - mouseY ) / 10, z: -10 }
        {x: ((0.5 * width - mouseX) / width) * targetWidth * targetsPosition[2] * 0.9 , y: (mouseY - height)/height * (targetsPosition[2] - 0.5 * 9.81) + targetsPosition[2] / 2.2, z: targetsPosition[2] * 1.05}
            )
    }

    return (
        <>
            
            <RigidBody
        position={position}

                ref={ballRef}
                name={Math.random()}
                colliders={"ball"}
                mass={2}
                restitution={0.2}
                friction={10}
                linearDamping={1}
                angularDamping={1}
            >
                <mesh castShadow scale={[scale,scale,scale]} position={position}>
                    <sphereGeometry onClick={applyImpulse} />
                    <meshNormalMaterial color="orange" />
                </mesh>
            </RigidBody>

        </>
    )
}
