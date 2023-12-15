import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import Icon from "./Icon";
import Target from "./Scenes/targets";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from 'three'
import { PerspectiveCamera } from "@react-three/drei";
import Scene from "./Scenes/Scene";
import { tSArrayType } from "@babel/types";
function App() {
  
  //   const {innerWidth: width, innerHeight: height} = window;
  //   const scrollBarHeight = (height * 0.3)
  //   console.log(scrollBarHeight)
  //   const [scrollValue, setScrollValue] = useState(-scrollBarHeight);
  //   function convertRemToPixels(rem) {
  //     return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  // }
  //   function navbarMorph() {
  //     // TODO: on scroll, morph banner to scroll up into navbar.
  //     //TODO: then morph into buttons and icons
  //     // TODO: reveal shaders fully, scene, and then go into copy and other things.
  //     setScrollValue(0);
  //     setNavContent(
  //       <motion.h1>Hello world</motion.h1>
  // //TODO: background fades into a gradient
  //   //TODO: 3D ICON (my name, but on hover, text switches to something else) My Empires, About me, (searchbar, settings optional?)
  //     )
  //     //TODO: show tagline
  //     //TODO: on scroll, push a 'half widget' with a canvas and 3d model with 'things' to the side
  //     //TODO: those like 'skill %bars'
  //   }

  //   const handleScroll = (event) => {
  //     event.preventDefault();
  //     const newScrollValue = scrollValue + event.deltaY;
  //     setScrollValue(newScrollValue);
  //     navbarMorph();
  //   };

  //   useEffect(() => {
  //     // Add event listener for scroll when component mounts
  //     window.addEventListener('wheel', handleScroll, { passive: false });

  //     // Cleanup: remove event listener when the component unmounts
  //     return () => {
  //       window.removeEventListener('wheel', handleScroll);
  //     };
  //   }, [scrollValue]); // Run this effect whenever scrollValue changes

  //   const [navContent, setNavContent] = useState(<div style={{ overflow: 'hidden' }} id='wrapper'>
  //   <motion.h1 style={{ overflow: 'hidden' }} id='title' animate={{ y: -scrollValue }}>
  //       I BUILD EMPIRES
  // </motion.h1>
  //     <motion.div style={{ overflow: 'hidden' }} id='banner-full' animate={{ y: -scrollValue }}></motion.div>
  //   </div>)
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
  const [trigger, setTrigger] = useState(0)
function onClick() {
  setTrigger((e) => e+1)
  console.log(mousePosition.x)
}
const cameraPosition = [0,0,0]

  return (
    <>
    <div onClick={onClick}>

      <Canvas 
        style={{ width: "100vw", height: "100vh" }}
        shadows
        dpr={[1, 2]}
        camera={{position: cameraPosition}}
        // camera={{position: cameraPosition}}
        
        // camera={{ fov: 50, position: [0, 0, 8] }}
        // onCreated={state => {
        //   const vec = new THREE.Vector3(0,2,0)
        //   state.camera.lookAt(vec)
        // }}
      >
        {/* {navContent} */}
        {/* <button style={{ overflow: 'hidden' }} onClick={navbarMorph}>
        Nav Morph
      </button> */}
        {/* <Icon/> */}
        {/* <div style={{ overflow: 'hidden', marginTop: '200vh', width: '50vw', backgroundColor: 'red', height: '10vh' }}></div> */}
        {/* <div> */}

        {/* </div> */}
        <Scene trigger={trigger} cameraPosition={cameraPosition}></Scene>
      </Canvas>
        </div>
    </>
  );
}

export default App;
