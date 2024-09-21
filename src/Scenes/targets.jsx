import { useRef, Suspense, useEffect, useState, useReducer } from "react";
import "../App.css";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    useGLTF,
    Stage,
    OrthographicCamera,
    OrbitControls,
    PerspectiveCamera,
    Html,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import Cannon from "./Cannon";
import { RigidBody } from "@react-three/rapier";

function targetDispatch(state, action) {
    if (state.hits == 3) {
        //TODO: change entire scene thing.
    }

    if (action.hit == "left") {
        state.left.color = [4, 0, 0];
        state.left.hit += state.left.hit;
        if (!state.text.has("left")) {
            state.hits += 0.5;
            if (state.hits == 1) state.setHtml1(state.text1);
        } else {
            state.setHtml1(state.text2);
        }
    } else if (action.hit == "middle") {
        state.middle.color = [4, 0, 0];
        state.middle.hit += state.middle.hit;
        if (!state.text.has("middle")) {
            state.hits += 0.5;
            if (state.hits == 1) {
                state.setHtml2(state.text1);
            } else {
                state.setHtml2(state.text2);
            }
        }
    } else if (action.hit == "right") {
        state.right.color = [4, 0, 0];
        state.right.hit += state.right.hit;

        if (!state.text.has("right")) {
            state.hits += 0.5;
            if (state.hits == 1) {
                state.setHtml3(state.text1);
            } else {
                state.setHtml3(state.text2);
            }
        }
    }
    console.log("hits");
    return state;
}

function Target({ position, targetsWidth, targetsHeightDiff, targetSpin }) {
    const htmlPosition = [-0.5, 0, 1];
    const textStyle = { color: "white" };
    const textProps = {
        textStyle,
        initial: { scale: 0 },
        animate: { rotate: 360, scale: 1 },
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
        },
    };
    const text1 = <motion.div {...textProps}>Words here</motion.div>;
    const text2 = <motion.div {...textProps}>Seconds words here</motion.div>;
    const [html1, setHtml1] = useState(<div></div>);
    const [html2, setHtml2] = useState(<div></div>);
    const [html3, setHtml3] = useState(<div></div>);
    const [targetState, targetStateDispatch] = useReducer(targetDispatch, {
        left: { color: [1, 0, 0], hit: 1, text: "" },
        middle: { color: [1, 0, 0], hit: 1, text: "" },
        right: { color: [1, 0, 0], hit: 1, text: "" },
        text: new Set(),
        hits: 0,
        setHtml1,
        setHtml2,
        setHtml3,
        text1,
        text2,
    });

    function onCollisionHit(ref) {
        targetStateDispatch({
            hit: ref.name,
        });
        console.log("isHappening", ref.name);
    }

    const scale = [1.5, 1.5, 1.5];
    const { nodes: targetNodes, materials: targetMaterials } = useGLTF(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target/model.gltf"
    );
    // useFrame((state,delta) => {
    // state.camera.lookAt([0,0,0])
    const { camera, scene } = useThree();

    // Set initial look-at position
    useEffect(() => {
        // Set the initial look-at position here
        // camera.position.set(0, 2, 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }, [camera]);
    const rididBodyProps = { colliders: "cuboid", type: "fixed",  };
    const targetMiddle = useRef();
    targetMiddle.name = "middle";
    const targetLeft = useRef();
    targetLeft.name = "left";
    const targetRight = useRef();
    targetRight.name = "right";

    return (
        <>
            <group position={position} scale={scale}>
                <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <RigidBody
                        onCollisionEnter={() => {
                            onCollisionHit(targetMiddle);
                        }}
                        {...rididBodyProps}
                    >
                        <mesh
                            geometry={targetNodes.Cylinder015.geometry}
                            ref={targetMiddle}
                        >
                            <meshStandardMaterial
                                args={[targetMaterials["White.024"]]}
                                aoMapIntensity={0}
                                envMapIntensity={0.7}
                                color={targetState.middle.color}
                            ></meshStandardMaterial>
                        </mesh>

                        <mesh
                            geometry={targetNodes.Cylinder015_1.geometry}
                            material={targetMaterials["White.024"]}
                            material-color={[1, 1, 8]}
                        />
                    </RigidBody>
                    <Html position={htmlPosition}>{html2}</Html>
                </group>
                <group
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[targetsWidth, -targetsHeightDiff, 0]}
                    rotation-z={-targetSpin}
                >
                    <RigidBody
                        {...rididBodyProps}
                        onCollisionEnter={() => {
                            onCollisionHit(targetRight);
                        }}
                    >
                        <mesh
                            geometry={targetNodes.Cylinder015.geometry}
                            ref={targetRight}
                        >
                            <meshStandardMaterial
                                args={[targetMaterials["White.024"]]}
                                aoMapIntensity={0}
                                envMapIntensity={0.7}
                                color={targetState.right.color}
                            ></meshStandardMaterial>
                        </mesh>

                        <mesh
                            geometry={targetNodes.Cylinder015_1.geometry}
                            material={targetMaterials["White.024"]}
                            material-color={[1, 1, 8]}
                        />
                    </RigidBody>
                    <Html position={htmlPosition}>{html3}</Html>
                </group>

                <group
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[-targetsWidth, -targetsHeightDiff, 0]}
                    rotation-z={targetSpin}
                >
                    <RigidBody
                        {...rididBodyProps}
                        onCollisionEnter={() => {
                            onCollisionHit(targetLeft);
                        }}
                    >
                        <mesh
                            geometry={targetNodes.Cylinder015.geometry}
                            ref={targetLeft}
                        >
                            <meshStandardMaterial
                                args={[targetMaterials["White.024"]]}
                                aoMapIntensity={0}
                                envMapIntensity={0.7}
                                color={targetState.left.color}
                            ></meshStandardMaterial>
                        </mesh>

                        <mesh
                            geometry={targetNodes.Cylinder015_1.geometry}
                            material={targetMaterials["White.024"]}
                            material-color={[1, 1, 8]}
                        />
                    </RigidBody>
                    <Html position={htmlPosition}>{html1}</Html>
                </group>
            </group>

            <group></group>
        </>
    );
}

export default Target;

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
useGLTF.preload(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shooting-target/model.gltf"
);

useGLTF.preload(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target/model.gltf"
);

useGLTF.preload(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target/model.gltf"
);
