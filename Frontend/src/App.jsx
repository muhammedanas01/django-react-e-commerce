import { useState } from 'react'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Navigate, Link } from "react-router-dom";

import Login from './views/auth/Login'
import Homee from './views/auth/Homee';
import Register from './views/auth/Register';
import Logout from './views/auth/Logout';
import Password from './views/auth/Password'; // requesting for reseting pass
import CreatePassword from './views/auth/CreatePassword'; // request accepted and change password

function App() {
  const [count, setCount] = useState(0)
  return (
  <BrowserRouter>
    <Routes>
        {/* <Route path='/' element={<Navigate to='/login'/>}/> */}
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/logout' element={<Logout />}/>
        <Route path='/forget-password-reset' element={<Password />}/>
        <Route path='/create-new-password' element={<CreatePassword />}/>
        <Route path='/' element={<Homee />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
