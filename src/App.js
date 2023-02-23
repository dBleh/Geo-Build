import React, { useEffect, useRef } from 'react';
import animate from './frontend/Main.js';
import Header from './frontend/Header';
import Popup from './frontend/Popup.jsx';

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    animate();
  }, []);

  return (
    <>
      <Header />
      <Popup/>
      <div ref={mountRef} />
    </>
  );
}

export default App;