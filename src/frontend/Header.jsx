import React from 'react';
import {addObj} from './Main.js' ;
function Header() {

  const onClick = (objType) =>{
    addObj(objType)
  }
  return (
    <header>
      <ul>
        <li>Rust Base Builder</li>
        <li onClick={() => onClick("floor")}>Add Floor</li>
        <li onClick={() => onClick("wall")}>Add Wall</li>
      </ul>
      
    </header>
  );
}

export default Header;