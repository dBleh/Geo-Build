import React from 'react';
import {addCube} from './Main.js' ;
function Header() {

  const onClick = () =>{
    console.log('hi')
    addCube()
  }
  return (
    <header>
      <ul>
        <li>Rust Base Builder</li>
        <li onClick={onClick}>Add Cube</li>
      </ul>
      
    </header>
  );
}

export default Header;