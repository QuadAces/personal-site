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
import { Bloom, EffectComposer, Texture } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import Cannon from "./Cannon";
import { RigidBody } from "@react-three/rapier";
import Flag from "react-world-flags";
import Skillbar from "../Components/Skillbar";
import StackIcon from "tech-stack-icons";
import ImageGlow from "react-image-glow";

function targetDispatch(state, action) {
    if (state.hits == 3) {
        //TODO: change entire scene thing.
    }

    if (action.hit == "left") {
        state.left.color = [4, 0, 0];
        state.left.hit += state.left.hit;
        if (!state.left.text) {
            if (state.hits == 0) {
                state.setHtml1(state.text1);
                state.left.text = true;
            } else if (state.hits == 1) {
                state.setHtml1(state.text2);
                state.left.text = true;
            }
            state.hits += 0.5;
        }
    } else if (action.hit == "middle") {
        state.middle.color = [4, 0, 0];
        state.middle.hit += state.middle.hit;
        if (!state.middle.text) {
            if (state.hits == 0) {
                state.setHtml2(state.text1);
                state.middle.text = true;
            } else if (state.hits == 1) {
                state.setHtml2(state.text2);
                state.middle.text = true;
            }
            state.hits += 0.5;
        }
    } else if (action.hit == "right") {
        state.right.color = [4, 0, 0];
        state.right.hit += state.right.hit;

        if (!state.right.text) {
            if (state.hits == 0) {
                state.setHtml3(state.text1);
                state.right.text = true;
            } else if (state.hits == 1) {
                state.setHtml3(state.text2);
                state.right.text = true;
            }
            state.hits += 0.5;
        }
    }

    console.log(state.hits, "HITS ARE HERE");

    return state;
}

function Target({ position, targetsWidth, targetsHeightDiff, targetSpin }) {
    const htmlPosition = [0, 0, 1];
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
    const countryStyleProps = {
        boxShadow: "0 0 30px 3px #c717ca",
        padding: 0,
        margin: 0,
    };
    const text1 = (
        <motion.div
            {...textProps}
            className="center card bg-black w-96 shadow-xl p-8 mt-10 opacity-90"
        >
            <div className="flex col h-10 justify-between mb-5">
                <ImageGlow radius={30} saturation={500} className="px-2">
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAMAAAD0WI85AAAAwFBMVEUBIWn////kACvkACboPlX71973+PsAH2h2g6fkACgAEWMAHWfoK0zlGjYAFmX7/P773uL+8fWAiKdSZ5cAAF3jACH+9/kAGmYAAFkAAGEADmNdNG7udofjABvvACTXKUoaMHHr7vRndp46TYT3u8bY3OfjABH/5+ojOnjDydjiAAD6zdb3xMvrSmVecJ3yk6HsZHXnH0OttMjXvs6ircdFWY2MmLftW23Sla3zoKv2r7spQ4DwiZfWSWUNKW7ubYDRKqSnAAAIrklEQVR4nO1bf3uivBI1Yg0ShapoCrfsy4/GlVq1ZYFexavf/1u9CShQBQWVrt6n5499ui0ETmbmZDITatO3IdiCmGMB1XIg9CTw2ObqIVqdLgB9Me9aJOgmAd35R6veGtQ//2vljnpFDAbvL90dFbunqzD7uhJEBJ23weOiPWrVB/XNEhALV/b6CVp0zt5fdkwkmxeFTCpFiSBRmRGpu2pwXH0w+pzQC7+HyAfHUSrTSUzFmNXEDFcoRgQJa0Zj3o5Gjdz2e4gM540BfehomjgY4QP1gEoRIlFs/F50RnTEzufOzt9DxKYPbmvUm7n3lyTseSiUJyLAHo2NeUPj6tzgfRlPjDPOiburYpw1h6BJTEVA6eefIoIEpU+kYeRUo/ZbYl/zW3iw4PQIAPN2a0BfoPFFjNOxcpwI3ApuR/s6IRKZCVkRVwmgKFK57C6mI6oz2udXMY5f4iiRUHB/bwX3fZnQ6KnZGnjync6koq577EU+mIN9FWO0i5V8IlBUeJsqFRWNOjdKTwQ/zluVTtHQz/VG6hoz6hqLDlOwzvQtmVNTjVwjjwgScRIbXCMlGOb6XKfCHr+vNcWBRNkkEpg32Au9TlPBSucV5RH5IrhpW9IJyE93jgCuBQwVxxboC53NRagxT1+2WawMUmJs92pqJhEY3vG4aIxC+V4md/j0jrMAAz+Q5SYJ5IA/P0VDqs7v5lfrpOeXV+RDIkokuKENqd6lBfcsa0TvYBsOD5q+YzjjC+QOiaJHHWzx0aIvN2hP4jk2+gdEZrMwwz2MKnyJ4OLA2D6xZD4g7EGVFZNp0FTTtNFrSoOMfSKEOlXnlV6Wig22kMrq3pBiGQmCMh8N5cvlZoDPgmOAx+Xq+fl587x8BDG+EhlO5ht6yfMicSrD5s3D0cwSYgrD5TmMs9lhwncMzUxIdKThFnlEwMHfQfZYJZJGqDvN2EltvQwTUAJ7RIqiTPbr8b4bmoS4Pu+ViZKHEnihe9ctkUmJ2/6U0FFMg9ShmyLgPqlCqWhvlEC7HqPMbf/7T6loX9vA7DXtkrFe48ogIVLipsE/pYigwO7Jas8oS6ReOVoliVh9mjUqPiyZN94ckVqYxENx/X9A5Cz8EPkhUhFuTn6P4OgwN7cgnsvkxlKUI0DB7Nju98aSxhxABGuiadcgRHlWyU/jd0jS+WwiqXT/4jQ+j8faWguKa3iqOB7nXJOxrTLpxmrHZPg2Z5unzYr1B7KJPC6f2QZrtXy4wsYqB9hxeN0Avb5v93NmJXOrG29uXjb1kaa9duYPWVvdLbpv01d6ldaeP0oXb3VziHjUsHQHagCnWBVyW3zYYjLtDFrcoL7q5hUfYrtNOXol114NyxQfSuyABX8bb3oRN43KQck8jxiNxqp7pBwU2+7tk5HWBvPfhctBcF3Y5zDmjfAxzriAfcNy226OXzbaoN5i7nKqQJfcMYjvKFSgw/2ClVGIvXgrT07l92HJNJnf93B+62x+o1J0dsk0aickDhbZcN4Fp0qmCCOIXQdD+sNJIshzSWQQ0DRs85hLRkXs3QtNpgPm8R8rVjUsVMSOo+qzzqh0VsPjRWy6uI0xMkggjGdBETdEKs9mmch0HcnnEbUV4nl9py7CaQ1qjeJthdiWS2pL6mCdxePRtoJCiMsD4PvELlQZhYoLiCM15SM8okZPLLjPdfYiH9TTSblGTywS76NwIlbULXMbPdgzACXfpHJYrOqu2oYFXamWb2RR6e8LrsZF2lO29ZbEisYcrB06WHbrDaqRnkq+Uki54NqdqQi5+aWusbkvuFwjXA3OaYbGDjaJxFhjK1BWMxSpnhPOnuT0UaEERq8xbVHzG6up2NhwzCXa1LtZe3rvjkLtad6ObUtzgkiMHzLa09DyY85Np0xynG++WHA3HY3OYYfFxmUHBnb2nWztO/9z6A9BL6mM+tZVtitbV2i0IsEdgisc4YgnJxLjjB0ixFhxgCQBV8FXSMW2RKjOsODU2EJ2jUM1qYX1hYoxl7nVhYIN/J5ky9faPbLUIhLcRSS4VzrmlETeKJMI0gm1ht9UrsSj9jatj379+tVZdE8dPAPg98evLerg9MGzHR42mUQsc02zFP/E+Q5ceE+miGESBlX5ST6aHQlPT3L8dyQ/PR1byJBAL4ggKzjzXWEYGyeyRuyV6pHcKrAoO44s3j0V7PVNwzD7d28Umo9J7Ehf3i79fiDQzJJmleefS7kV4IBqHwnu3iA10SS8SczzT9fcCqCuC4J+eVXs7wPShSu3RnopKhv4m4H733NotHKojn//ckiB1jYp28q/SeC+Ae45StAu7xV9AHrq/m/vBsgK5DAZZydeAImIYDUoVCS8JSDPdj1Wa8NBMzptCEXZcu1v+QzhmmDtiSbhVVUxw6KarIozYgD33gxC8UTCElQ/3IzbM5eVF+z1HRIRWUZNjQGSf5v3mV9jF+zBP/Ow9V8GWttfeZDzvkT4+9g61w6Gd6fbBCiIJE3E1u8yQiBOd1HCUCeefH82wdjai5DQKP3idcByKHsws+iwQuAbhzxonLhBJREP9Wq+7hVNkkUjlK7e+soPg+EDXbV29hdj+UOPTd+1iSFJqSCh/zGI7frX/sgQrmsilm0bYnFd9sDsSSBRVRRZVkQ+4WFi+huZ5lxXfhj2XN4SAfEC3vWqyoCEhAjgq1rWZRcQG0g2AW5FT6CZe9hRjsLerWq/i9bbgCx2DugcQOQwHrOAhYp9tU7THrDKR6FoVtZOgJCuJU1TVWfUKCS7e3MxcKz0TdeqaMGFNSOKDcw3Abnk27ojmKUWXlJRPwHpQApjHFL5Mirqvowty2IeDBz6Q0VVX2yBXrSQQ5k3KqqRQ4RVBxACHBlXVXYSZ368aog+X1XGiHTbsDxSYRkQBUnSgPSKYoSVnpyZSjc/Vcli7WvuU1F+ykYOwmqTpVf1gG9DVL+8wwLND37wgx/84Ad/H/8C2X0Qzv3HLbgAAAAASUVORK5CYII="
                        width={"100px"}
                        // style={{ ...countryStyleProps }}
                    />
                </ImageGlow>
                <ImageGlow radius={30} saturation={500} className="px-2">
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAMAAAD0WI85AAAAb1BMVEXVKx7////VJhj77e3ZTEXSAADVKRvTEwD45OPUIxP11dTUHgv12NfTGwT66unqp6TYQzrxxsTXPDP99/fpoJ3sr67jg3/zz87vu7nkjYzVLybhdnPifHrbWVLWMizkh4XfbWfmlJPaUkzcXFndZV/LoNpvAAAEO0lEQVR4nO2ba5uqIBCAQXcYCTUvmbZqnaz//xtParVdwHR3zwF6nC+7Tzk0LzDMMCAhE8X5cOk/F/fDmWrXZJlBZpAZZAaZQWwBCcM3Adls3gPEI8R7C5AN4tQhMRLEE4yJiUNiJMgmICSYOCQmgoTICGE4beEyEWSNrRaubQfxPlmrxT4neYmBICX2aljaCPLV+yFc9CCUfG06yLJenP+rgoteUJ0/WtRLa0A8EGX3lM/ZRY9xvzOxEmDPiKTAcLuiXx7SSuclyy0ySK0BoTUnDLbFCm81cVVsgRFev9Y3BmTXuoaDeK+K2JoX7CwCyVDdAGYWgcRc3QCPLQIJt0ylz7Yj0i5jQGikNMSJRqibA/JHqPTFH6tAlqDSh9dx3SSQhRpk8VrbIJBQuf6O2mJpB8ku2UdaKxZgXl8fGYgnukFCco3alcLbxSUJpjuiHhvdIEuAi50rxdzC1YUUBtz+/4O47m0qmzhXQ2MVSHwFdZIb1dS9a/a/gyzgsMl8emP8uZ9DxbJ13ih2y/MFivrZ5ni3mmmYWlEQICfNPvZS99g5OPYkXJqkMN5zdOPFj27qxfuGcAyCu4CvAWSPnXkIom762cSg62j5stVvRmLoKbGpBWCHjHvNIPnVXuf621BQlbd3LlTAsw7PNYO0Dv70iJO3vS7Tbkdr4UhUEqobZC3peYfkdB08f37aHq5pziRGPlQidYBIsyqHJaqAmMg4HjMwHSCudOvB1Bsr2TdO5GoHoTvl1mO8iIeChBYQuVdPE4gNAKGonEZjhSE1AaSSrk9T5FoX1gsiX2inSPB4DKQDxN8NFOPGCu58zSBeRX6B40RCSk8nSAE/9/ReGHYZmrYRicVAcXSKcHG7AmvwES/5namV3J3+6HD2tPyNgFgakKLQHfzQTxg8HploqqIUwY8chQfFY4u6ykF59IOYGET5U4Pa6lru4dsujwdZe/oKdN/NU+SXVHRWGjP4xm87IC8Aay2Z+snkQQkSX96W3tqv10x0FGxUdyB0F7GrSbERHnch5oDQDEcb4ODAGZx2EFrwkbGR86coaBTIyYRRJOJj8ATOABCaqo/YbxqJhm8ImQBCyxF1LvHiYqAJIKn69saXsK35I1KMCiY45OpmgNzNLB4AwMn7+enPXa7/Ym4ZAJL21QjGBSJAVGZ53gjR5HlWRgCIoj+SYzg4twwAyaA9hwNSV/vinIC45POs4hWrqibQnrYpskVzQA4sajaFH950uPtxq5KGfrFpInYwGySNn/NAN4qeVbx4aG7pB5FJuB1zac4CkLd5NckTU1/oMRUE8T1AfADFjtYykAWMuv5nPkgMj2edloIUAMMpoi0gGQznI9aALHGozmARyB7vL2NZC7JDHPHKiAUgZRBMenfPWJCjEMe3AGk4b94CJEIc886I+SB5HD8frtkI8g2ZQWaQGWQGeXuQv15zReZeRKz1AAAAAElFTkSuQmCC"
                        width={"100px"}
                        // style={{ ...countryStyleProps }}
                    />
                </ImageGlow>
                <ImageGlow radius={30} saturation={500} className="px-2">
                    <img
                        src="data:image/png;base64,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"
                        width={"100px"}
                        // style={{ ...countryStyleProps }}
                    />
                </ImageGlow>
            </div>
            {/* from https://stackoverflow.com/questions/8152426/how-can-i-calculate-the-number-of-years-between-two-dates */}
            Hi everyone! I'm Stuart⚡️, an{" "}
            {Math.abs(
                new Date(Date.now() - new Date(2005, 12, 1)).getUTCFullYear() -
                    1970
            )}{" "}
            year old developer in Sydney! In my free time, I like anything that
            takes a minute to learn and a lifetime to master - things like
            Sailing, Jiu Jitsu, Chess, Coding, 3D printing or anything
            entreprenurial.
            <br />
            <br />
            Among other things I'm obsessed with startups (my favourite book
            being 0 to 1). I love to build in my free time, winning the
            Australian Defence Force Future Innovator's award in 2023.
        </motion.div>
    );
    const text2 = (
        <motion.div
            {...textProps}
            className="center card bg-black w-96 shadow-xl p-8 mt-10 opacity-90"
        >
            {" "}
            Professionally, I'm a part of the subcommittees for UNSW's startup
            link (publications), Chess club (events) and Computer Science &
            Engineering Society (IT). I like to tutor on the side, and am a
            lifelong learner myself.
            <h2 className="text-xl mb-2">My web-dev knowledge & skills:</h2>
            <Skillbar
                percentage={95}
                text={"React"}
                image={<StackIcon className="w-6 h-6" name="reactjs" />}
            />
            <Skillbar
                percentage={90}
                text={"Node.js"}
                image={<StackIcon className="w-6 h-6" name="nodejs" />}
            />
            <Skillbar
                percentage={88}
                text={"Ionic"}
                image={<StackIcon className="w-6 h-6" name="ionic" />}
            />
            <Skillbar
                percentage={85}
                text={"Next.js"}
                image={<StackIcon className="w-6 h-6" name="nextjs2" />}
            />
            <Skillbar
                percentage={82}
                text={"Mongo"}
                image={<StackIcon className="w-6 h-6" name="mongodb" />}
            />
            <Skillbar
                percentage={77}
                text={"Three.js"}
                image={
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 103 104"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="threejs">
                            <g id="threejs_2">
                                <path
                                    id="Vector"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M26.7016 102L2 2.00049L101.023 30.5097L26.7016 102Z"
                                    stroke="white"
                                    stroke-width="2.2865"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                />
                                <path
                                    id="Vector_2"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M51.4929 16.2579L63.8349 66.2728L14.3511 52.0136L51.4929 16.2579Z"
                                    stroke="white"
                                    stroke-width="2.2865"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                />
                                <path
                                    id="Vector_3"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M39.2146 58.7971L33.0845 33.9514L57.6689 41.0087L39.2146 58.7971Z"
                                    stroke="white"
                                    stroke-width="2.2865"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                />
                                <path
                                    id="Vector_4"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M26.9519 9.13611L33.082 33.9818L8.49756 26.9245L26.9519 9.13611Z"
                                    stroke="white"
                                    stroke-width="2.2865"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                />
                                <path
                                    id="Vector_5"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M76.1186 23.2992L82.2487 48.1449L57.6643 41.0876L76.1186 23.2992Z"
                                    stroke="white"
                                    stroke-width="2.2865"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                />
                                <path
                                    id="Vector_6"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M39.2173 58.8142L45.3474 83.6599L20.7629 76.6026L39.2173 58.8142Z"
                                    stroke="white"
                                    stroke-width="2.2865"
                                    stroke-miterlimit="10"
                                    stroke-linejoin="round"
                                />
                            </g>
                        </g>
                    </svg>
                }
            />
            <Skillbar
                percentage={68}
                text={"Docker"}
                image={<StackIcon className="w-6 h-6" name="docker" />}
            />
            <Skillbar
                percentage={60}
                text={"MySQL"}
                image={<StackIcon className="w-6 h-6" name="mysql" />}
            />
        </motion.div>
    );
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
    const rididBodyProps = { s: "cuboid", type: "fixed", scale: 2 };
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
                    <Html
                        style={{ transform: "translateX(-50%)" }}
                        position={htmlPosition}
                    >
                        {html2}
                    </Html>
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
                    <Html
                        style={{ transform: "translateX(-50%)" }}
                        position={htmlPosition}
                    >
                        {html3}
                    </Html>
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
                    <Html
                        style={{ transform: "translateX(-50%)" }}
                        position={htmlPosition}
                    >
                        {html1}
                    </Html>
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
