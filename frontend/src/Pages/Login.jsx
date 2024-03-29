import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {  reset, login } from '../features/authSlice'


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password, } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user,isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess && user) {
      navigate('/homepage')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      email,
      password,
    }
    dispatch(login(userData))
  }
  return (
    <>
    <div className='loginPage'>
      <div  className='heading'>
        
        <p>Login</p>
      </div>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
    
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn-block'>
              Submit
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  )
}

export default Login
