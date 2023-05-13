import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./login.css"

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let errors = {};
        if (!email) {
            errors.email = "Email is required";
        }
        if (!emailRegex.test(email)) {
            errors.not = "this is not Email";
        }
        if (!username) {
            errors.username = "username is required";
        }
        if (password1.length<6) {
            errors.weak = "password must be at least 6 characters long";
        }
        if (!password1) {
            errors.password1 = "Password is required";
        }
        if (!password2) {
            errors.password2 = "Password is required";
        }
        if (password1 !== password2) {
            errors.password2 = "Password confirmation does not matchf";
        }

        if (Object.keys(errors).length === 0) { 
            try {
                const res = await axios.post('http://localhost:5000/register', { email, username, password: password1 });
                if (res.data.bien) {
                    navigate("/login")
                }
                else if (res.data.exist) {
                    errors.exist = "cet utilisateur existe déja";
                }
                else {
                    errors.error = "il y a un error au niveau d'info";
                }
            } catch (err) {
                console.error(err);
            }
        }
        setErrors(errors);
    };
    return (
        <div className='loginContainer'>
            <form onSubmit={handleSubmit} className='loginform'>
                <h1>Regester page</h1>
                {errors.exist && <div className="error">{errors.exist}</div>}
                {errors.error && <div className="error">{errors.error}</div>}
                <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <div className="error">{errors.email}</div>}
                {errors.not && <div className="error">{errors.not}</div>}
                <input type="text" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                {errors.username && <div className="error">{errors.username}</div>}
                <input type="password" placeholder='password' value={password1} onChange={(e) => setPassword1(e.target.value)} />
                {errors.password1 && <div className="error">{errors.password1}</div>}
                {errors.weak && <div className="error">{errors.weak}</div>}
                <input type="password" placeholder='confirm password' value={password2} onChange={(e) => setPassword2(e.target.value)} />
                {errors.password2 && <div className="error">{errors.password2}</div>}
                <input type="submit" value="Regester" />
            </form>
        </div>
    )
}
export default Register