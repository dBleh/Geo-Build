import React from 'react';
import {addObj} from './Main.js' ;
function Popup() {

  const onClick = (objType) =>{
    addObj(objType)
  }
  return (
    <section className="custom-details">
      
     
        <li onClick={() => onClick("wall")}>Add Wall</li>
        <li onClick={() => onClick("floorT")}>Add Triangle Floor</li>
        <li onClick={() => onClick("floor")}>Add Floor</li>  
    
      
    </section>
  );
}

export default Popup;