
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { logout } from '../features/authSlice';
function Header() {
  const { user, } = useSelector(
    (state) => state.auth
  )
  const navigate = useNavigate()
  var [accInfo,setAccountInfo] = useState(false)
  const dispatch = useDispatch()
  const onLogout = () => {
    dispatch(logout())
    navigate('/homepage')
  }
  const onClick = () => {
   setAccountInfo(!accInfo)
  }
  return (
    <header>
      <div className='headerItem'>
        <ul>
          <h1><Link to='/homepage' className="activeLink">GeoBuild</Link></h1>
          {user ?
            <>
              <li><Link to='/savedbuilds' className="activeLink">Saved Builds</Link></li>
              <li><Link to='/workspace' className="activeLink">Work Space</Link></li>
              <li>
                <div className='accountDropDown' onClick={onClick}>
                  <li>{(user.name[0]).toUpperCase()}</li>
                {accInfo ? <button className='logBtn' type='submit' onClick={onLogout}>Logout</button> : null}
                </div>
              </li>
             
            </>
            :
            <>
              <li><Link to='/login' className="activeLink">Login</Link></li>
              <li><Link to='/register' className="activeLink">Register</Link></li>
            </>
          }
        </ul>
      </div>
    </header>
  );
}

export default Header;