import React, { useEffect, useRef } from 'react';
import animate from './Main.js';

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    animate(mountRef.current);
  }, []);

  return <div ref={mountRef} />;
}

export default App;
