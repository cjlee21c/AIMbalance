import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";





function Signup() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 


    const handleSignup = (e) => {
        e.preventDefault();
        setLoading(true);

        fetch('http://localhost:3000/signup',{                                                                                                                                                                                                                                                                                                                 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email}),
        })
        .then((response) => {
            if (!response.ok){
                throw new Error('Signup failed');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Response from server: ', data);
            setMessage('Signup successful!');
            setTimeout(() =>{
              navigate('/Login');
            }, 1500);
            
        })
        .catch((error) => {
            console.error('Error during fetch:', error);
            setMessage("Something went wrong")
        })
        .finally(() => {
          setLoading(false);
        });
    };
    
    return (
      <div className="Login">
        <form onSubmit= {handleSignup}>
          <h1 className='h1'><strong>Sign-Up</strong></h1>
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
                required></input>
          </div>
          <div className='input-box'>
            
            <input type= "email" 
              placeholder='Email' 
              onChange={(e) => setEmail(e.target.value)} 
              required>
            </input>
          </div>

          <div className='remember-forgot'>
            <label><input type="checkbox" />Remember me</label>
            <a href = '#'>Forgot Password?</a>
          </div>
          <button type="submit" disabled = {loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
          {message && <p style={{color:'black', fontSize: '30px'}}>{message}</p>}
        </form>
      </div>
    );
  }
  
  export default Signup;
  