import { useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import useWindowDimensions from "../Hooks/windowDimentions";

export default function CannonBall({
    mouseX,
    mouseY,
    position,
    scale,
    targetsPosition,
    targetWidth,
}) {
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    useEffect(() => {
        const updateMousePosition = (ev) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener("mousemove", updateMousePosition);
        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    const ballRef = useRef();

    useEffect(() => {
        requestAnimationFrame(() => {
            applyImpulse(mouseX, mouseY);
        });
    }, []);

    const { height, width } = useWindowDimensions();

    function applyImpulse(mouseX, mouseY) {
        console.log((mouseX - 0.5 * width) * 1, "HERE VERY IM,PORTANT");

        ballRef.current.applyImpulse(
            // { x: (mouseX - width / 2) / 10, y: (height /2 - mouseY ) / 10, z: -10 }
            {
                x: (mouseX - 0.5 * width) / 28,
                y: ((mouseY - height) / height) * targetsPosition[2] - 4.5,
                z: targetsPosition[2] * 1.05,
            }
        );
    }

    return (
        <>
            <RigidBody
                position={position}
                ref={ballRef}
                name={Math.random()}
                colliders={"ball"}
                mass={2}
                scale={1}
                restitution={0.2}
                friction={10}
                linearDamping={1}
                angularDamping={1}
            >
                <mesh
                    castShadow
                    scale={[scale, scale, scale]}
                    position={position}
                >
                    <sphereGeometry onClick={applyImpulse} />
                    <meshNormalMaterial color="orange" />
                </mesh>
            </RigidBody>
        </>
    );
}
