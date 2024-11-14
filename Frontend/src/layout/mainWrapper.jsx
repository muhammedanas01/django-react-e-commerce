import { useEffect, useState } from "react";
import {setUser} from '../utils/auth'

import React from 'react'
// mainWrapper prevent accessing the componets until setAuthUser task are completed or in other words, the state hasnt finished loading
const  mainWrapper = ({childern}) => {
    const [loading,setLoading] = useState(true)

    useEffect(async () => {
        const handler = async () => {
            setLoading(true)
            await setUser()
            setLoading(false) 
        }       
        handler()
    },[]) //empty array as the second argument to useEffect, it means the effect will run only once when the component is mounted.
    
    return <>{loading ? null : childern}</>//it returns null if loading else it returns children.
    //Why Return null Instead of true? because React expects components to return JSX so true would cause error.
}

export default mainWrapper
