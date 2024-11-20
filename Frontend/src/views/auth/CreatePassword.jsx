import React from 'react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom' // hook to get query parameter from url
import apiInstance from '../../utils/axios'
import { useNavigate } from 'react-router-dom'

function CreatePassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [searchParam] = useSearchParams()
  const otp = searchParam.get("otp")// this is the otp generated when user requested for password reset
  const uidb64 = searchParam.get("uidb64")


  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if(password !== confirmPassword){
      alert("Password does not match")
    } else {
      // sents the otb,password and uidb64 to backend for verification.
      const formData = new FormData()
      formData.append('password', password); 
      formData.append('otp', otp);
      formData.append('uidb64', uidb64);

      try{
        await apiInstance.post(`user/password-change/`, formData)//sending form data to backend.
        .then((response) => { console.log(response.data) })
        alert("password changed successfully")
        navigate('/login')

      } catch (error){
        alert(console.error(error))
      }
    }
  }

  return (
    <div>
      <h1>Creat New Password</h1>
      <form onSubmit={handlePasswordSubmit}>

          <input
              type="password"
              name=''
              id=''           
              placeholder='Enter New Password'  
              onChange={(e) => setPassword(e.target.value)}         
          />
          <br />
          <br />
          <input
              type="password"
              name=''
              id=''           
              placeholder='Confirm New Password'    
              onChange={(e) => setConfirmPassword(e.target.value)}            
          />

          <button type="Submit">Save New Password</button>

      </form>
    </div>
  )
}

export default CreatePassword