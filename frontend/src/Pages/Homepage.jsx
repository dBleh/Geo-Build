import React, { useEffect, useRef } from 'react';

import Header from './Header';

function HomePage() {
  

  return (
    <>
    
      <Header />
      <div className='homePage'>
    
      <h2>Welcome to GeoBuild</h2>
      <ul>
        <li>
      <p>Geo build is a simple web building tool where users can create, place, move, and delete objects placed within a 3d environment</p>
      <p>You are able to save a scene after creating one!</p>
      <p>Register an account to get started!</p>
      </li>
      </ul>
      </div>
    </>
  ); 
}

export default HomePage;
