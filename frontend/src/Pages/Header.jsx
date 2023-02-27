import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../features/authSlice';
function Header() {
  const { user, } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()
  const onLogout = ()=>{
    dispatch(logout())
  }
  return (
    <header>
      <div className='headerItem'>
        <ul>
          <h1>GeoBuild</h1>
          {user ? 
          <> 
          <li><Link to='/homepage' className="activeLink">WorkSpace</Link></li>
          <li><Link to='/savedbuilds' className="activeLink">SavedBuilds</Link></li>
          <li><Link to='/nworkspace' className="activeLink">nWorkSpace</Link></li>
          <li><button className = 'logBtn' type='submit' onClick={onLogout}>Logout</button></li>
          </>
         :<>
         <li><Link to='/login' className="activeLink">Login</Link></li>
         <li><Link to='/register' className="activeLink">Register</Link></li> 
         </>}
          
         
        </ul>
      </div>
    </header>
  );
}

export default Header;