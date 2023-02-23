import React from 'react';
import {addObj} from './Main.js' ;
function Popup() {

  const onClick = (objType) =>{
    addObj(objType)
  }
  return (
    <section className="custom-details">
        <li onClick={() => onClick("wall")}>Wall</li>
        <li onClick={() => onClick("floorT")}>Triangle Foundation</li>
        <li onClick={() => onClick("floor")}>Square Foundation</li>      
    </section>
  );
}

export default Popup;