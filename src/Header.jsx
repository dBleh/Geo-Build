import React from 'react';
import {addCube} from './Main.js' ;
function Header() {

  const onClick = () =>{
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