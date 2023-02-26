import React, { useEffect, useRef } from 'react';
import { animate, stop } from '../Main.js';
import Header from './Header';
import Popup from './Popup.jsx';

function HomePage() {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current = animate();
    return () => {
      stop()
    }
  }, []);
 

  return (
    <>
      <Header />
      <Popup />
      <div ref={mountRef} />
    </>
  ); 
}

export default HomePage;
