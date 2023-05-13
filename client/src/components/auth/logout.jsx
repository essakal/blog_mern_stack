import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
    // {localStorage.removeItem("token")}
    const navigate = useNavigate()
    useEffect(()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
        window.location.reload()
    },[])
  return (
    <div>logout</div>
  )
}
