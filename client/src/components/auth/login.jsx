import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./login.css"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  // const [myData, setMyData] = useState(null);

  // useEffect(() => {
  //   const data = localStorage.getItem('token');
  //   setMyData(data);
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length === 0) {
      try {
        const res = await axios.post('http://localhost:5000/login', { email, password });
        localStorage.setItem('token', res.data.token);
        // console.log(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.token) {
          navigate("/")
          window.location.reload()
        }
        else {
          errors.all = "Email Or Password incorrect"
        };
      } catch (err) {
        console.error(err);
      }
    }
    setErrors(errors);
  };
  return (
    <div className='loginContainer'>
      <form onSubmit={handleSubmit} className='loginform'>
        <h1>login page</h1>
        {errors.all && <div className="error">{errors.all}</div>}
        <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <div className="error">{errors.email}</div>}
        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <div className="error">{errors.password}</div>}
        <input type="submit" value="Login"/>
      </form>
    </div>
  )
}

export default Login