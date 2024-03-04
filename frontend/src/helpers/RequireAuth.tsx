import React from 'react'
import {Navigate,Outlet} from 'react-router-dom'
import { AuthContext } from '../context/AuthContextProvider'


export const RequireAuth = () => {
    const {isAuthenticated}=React.useContext(AuthContext)


    if(isAuthenticated===null){
        return <div>Loading...</div>
    }

    if(isAuthenticated===true){
        return <Outlet/>
    }
  return (
    <Navigate to="/login"/>
  )
}