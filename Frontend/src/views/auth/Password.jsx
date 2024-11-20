import React from 'react'
import apiInstance from '../../utils/axios'
import {useNavigate} from 'react-router-dom'

import { useState } from 'react'
// forgot password
function Password() {
    const [email, setEmail] = useState("")
    const naviagte = useNavigate()

    const handleSumbit = () => {
       try{
        apiInstance.get(`user/password-reset/${email}/`)// here we will sent email to this endpoint.
        .then((Response) => {
            console.log(Response.data)
            alert("an email has been sent you.")
        })
       }catch (error) {
        alert(error)
       }
    }

    
  return (
    <div>
        <h1>Forget Password</h1>
        <input 
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder='enter your registerd email'
            name=''
            id=''
        />
        <br />
        <br />
        <button onClick={handleSumbit}>Reset Password</button>
    </div>
  )
}

export default Password