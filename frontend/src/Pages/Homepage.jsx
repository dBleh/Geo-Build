import React, { useEffect, useRef } from 'react';
import animate from '../Main.js';
import Header from '../Header';
import Popup from '../Popup.jsx';
function HomePage() {
    const mountRef = useRef(null);

    useEffect(() => {
            animate();
        }, []);

    return (
        <>
            <Header />
            <Popup />
            <div ref={mountRef} />
        </>
    );
    
}

export default HomePage

