import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {  reset, register } from '../features/authSlice'


function Register() {
  const [formData, setFormData] = useState({
    name: '',
  email: '',
  password: '',
  password2: ''
  })
  const {name, email, password, password2} = formData
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
      name,
      email,
      password,
      password2
    }
    dispatch(register(userData))
  }
  return (
    <>
      <div className='loginPage'>
      <div className='heading'>
      
        <p>Create account</p>
      </div>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
             
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm password'
              onChange={onChange}
            />
          </div>   
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  )
}

export default Register
