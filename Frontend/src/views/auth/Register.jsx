// for signup
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { register } from '../../utils/auth'


function Register() {

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [isLoading, setIsLoading] = useState("")
    
    const navigate = useNavigate()
    const isLoggedIn = useAuthStore((state) => state.setLoggedIn)

    useEffect(() => {
        if(isLoggedIn()){
            navigate('/homee')
        } else {
            //navigate('/register')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const {error} = await register(fullName, email, mobile, password, password2)
        if (error) {
            alert(JSON.stringify(error))
        } else {
            navigate('/homee')
        }

        setIsLoading(false)

    }

  return (
    <div>
        <h1>REGISTER</h1>
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder='Full Name'
                name='full_name'
                id='' 
                onChange={(e) => setFullName(e.target.value)}           
            />
            <br />
            <br />

            <input 
                type="email" 
                placeholder='example@gmail.com'
                name=''
                id=''
                onChange={(e) => setEmail(e.target.value)}          
            />
            <br />
            <br />

            <input 
                type="text" 
                placeholder='Mobile Number'
                name=''
                id=''
                onChange={(e) => setMobile(e.target.value)}          
            />
            <br />
            <br />

            <input 
                type="password" 
                placeholder='Enter Your Password'
                name=''
                id=''
                onChange={(e) => setPassword(e.target.value)}              
            />
            <br />
            <br />

            <input 
                type="password" 
                placeholder='Confirm Your Password'
                name=''
                id=''
                onChange={(e) => setPassword2(e.target.value)}             
            />
            <br />
            <br />
            <button type='submit'>Register</button>
        </form>
    </div>
  )
}

export default Register