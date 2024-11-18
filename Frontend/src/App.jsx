import { useState } from 'react'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Navigate, Link } from "react-router-dom";

import Login from './views/auth/Login'
import Homee from './views/auth/Homee';
import Register from './views/auth/Register';

function App() {
  const [count, setCount] = useState(0)
  return (
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<Navigate to='/login'/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/homee' element={<Homee />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
