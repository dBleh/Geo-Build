import React from 'react';
import {addObj} from '../Main.js' ;
function Popup() {

  const onClick = (objType) =>{
    addObj(objType)
  }
  return (
    <section className="custom-details">
      <div className='listOne'>
      <li onClick={() => onClick("wall")}>Wall</li>
      <li onClick={() => onClick("floorT")}>Triangle Foundation</li>
        <li onClick={() => onClick("floor")}>Square Foundation</li> 
      </div>
      <div className='listTwo'>
      <li onClick={() => onClick("roof")}>Square Roof</li>
        <li onClick={() => onClick("roofT")}>Triangle Roof</li>    
        <li onClick={() => onClick("door")}>Door</li> 
      </div>
        
        
       
      
        
    </section>
  );
}

export default Popup;