import React from 'react'
import { useEffect } from 'react'
import { logout } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'


function Logout() {
    const navigate = useNavigate()

    useEffect(() => {
        logout()
        navigate('/')
    },[])

  return (
    <div>Logout</div>
  )
}

export default Logout