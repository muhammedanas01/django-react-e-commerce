import React from 'react'
import { useAuthStore } from '../../store/auth'
import { Link } from  'react-router-dom'
import { useEffect } from 'react'

function Homee() {
  const [isLoggedIn, setIsLoggedIn] = useAuthStore((state) => [
    state.setLoggedIn,
    state.extractUserDetails
  ])
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {initializeAuth()}, [initializeAuth] );

  return (
    <div>
      {isLoggedIn() 
        ? <div>
          <h1>dashboard</h1>
          <Link to={'/logout'}>Logout</Link>
        </div>
        : //elseeeeeeee
        <div>
          <h1>Home page</h1>
          <div className='d-flex'>
          <Link className='btn btn-primary' to={'/login'}>Click here to Login</Link>
          <br />
          <br />
          <Link className='btn btn-success ms-4' to={'/register'}>Click here to SignUp</Link>
          </div>
        </div>
      }
      
    </div>
  )
}

export default Homee