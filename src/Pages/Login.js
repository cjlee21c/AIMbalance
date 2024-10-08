import React, { useState } from 'react';
import './Login.css';
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'; 
import { useSetRecoilState } from 'recoil';
import { isLoggedInStateAtom, usernameStateAtom } from '../atoms';
import {login} from '../apiRequests'


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 
    const setIsLoggedIn = useSetRecoilState(isLoggedInStateAtom);
    const setGlobalUsername = useSetRecoilState(usernameStateAtom);
  
    const handleLogin = async (e) =>{
      e.preventDefault();
      
      try{
        const data = await login(username, password);
        console.log("Response: ", data);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        setMessage('Successfully logged in!')
        setIsLoggedIn(true);
        setGlobalUsername(username);
        setTimeout(() =>{
          navigate('/Select');
        }, 1500);
      } catch (error) {
        console.error("Error during fetch:", error)
        setMessage('Something went wrong')
      }
    };

    return (
      <div className="Login" style={{paddingTop:'150px'}}>
        <form onSubmit = {handleLogin}>
          <h1 className='h1'>Login</h1>
          <div className='input-box'>
            <FaRegUser />
            <input 
              type = "text" 
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)} 
              required
            />            
          </div>
          <div className='input-box'>
            <RiLockPasswordFill />
            <input 
              type= "password" 
              placeholder='Password' 
              onChange={(e) => setPassword(e.target.value)}
              required
            />      
          </div>

          <div className='remember-forgot'>
            <label><input type="checkbox" />Remember me</label>
            <a href = '#'>Forgot Password?</a>
          </div>
          <button type="submit">Login</button>
          <div className='register'>
            <p>Don't have an account? <Link to='/Signup'>Register</Link></p>
          </div>
          {message && <p style={{color:'black', fontSize: '30px'}}>{message}</p>}
        </form>
      </div>
    );
  }

  export default Login;
  