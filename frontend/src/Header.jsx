import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  
  return (
    <header>
      <ul>
        <h1>Rust Base Builder</h1>
        <li><Link to='/homepage'>Broker Registeration</Link></li>

      </ul>
      
    </header>
  );
}

export default Header;