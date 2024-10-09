import React, { useEffect, useState } from 'react'
import {Routes, Route} from "react-router-dom"
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignupPage'
import Home from "./pages/home/HomePage"
import {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import {Navigate} from "react-router-dom"
const App = () => {

  const {data, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/getUser", {
          withCredntials: true,
          credentials: "include",
        })
        console.log(res)

        const data = await res.json()
        console.log(data)

        if(data.error) {
          return null
        }
        if(!res.ok) {
          throw new Error(data.error)
        }
        return data

      }
      catch(err) {
        console.log(err.message)
        throw new Error(err)
      }
 
    }
  })

  return (
    <div>
      <Routes>
       <Route path='/login' element={!data ? <LoginPage /> : <Navigate to={"/"} /> } />
      
        <Route path='/signup' element={! data ? <SignUpPage /> : <Navigate to={"/"} /> } />
        <Route path='/' element={data ? <Home /> : <Navigate to={"/login"} /> } />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
