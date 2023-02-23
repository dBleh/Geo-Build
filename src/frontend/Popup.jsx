import React from 'react';
import {addObj} from './Main.js' ;
function Popup() {

  const onClick = (objType) =>{
    addObj(objType)
  }
  return (
    <section className="custom-details">
      
      <ul>
        <li>Rust Base Builder</li>
       
        
        
        <li onClick={() => onClick("wall")}>Add Wall</li>
        <li onClick={() => onClick("floorT")}>Add Triangle Floor</li>
        <div class="arrow-right">
        <li onClick={() => onClick("floor")}>Add Floor</li>
        </div>
        <div class="arrow-left">
        <li onClick={() => onClick("floor")}>Add Floor</li>
        </div>
      </ul>
      
    </section>
  );
}

export default Popup;