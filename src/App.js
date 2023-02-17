import React, { useEffect, useRef } from 'react';
import animate from './Main.js';
import Header from './Header';

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    animate();
  }, []);

  return (
    <>
      <Header />
      <div ref={mountRef} />
    </>
  );
}

export default App;