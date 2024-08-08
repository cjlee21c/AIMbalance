import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import NegativeImpact from '../Assets/NegativeImpact.jpeg';
import ComputerVision from '../Assets/ComputerVision.jpeg';

import './Home.css';

function App() {
  const navigate = useNavigate();

  const handleStart = () => {
    const isLoggedIn = !!localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn){
      navigate('/select');
    } else {
      navigate('/login');
    }    
  };

  return (
    <div className="App">
      <div className="section welcome-section">
        <div className="text-container">
          <h2>
            <span style={{ color: 'red', fontWeight: 'bold',fontSize:'100px',display: 'block'}}>AIM</span>
            <span style={{ color: '#ffffff',fontSize:'40px',display: 'block' }}> your </span>
            <span style={{ color: 'red', fontWeight: 'bold',fontSize:'100px',display: 'block' }}>BALANCE</span>
          </h2>
          <p>Check your imbalance and prevent further pain!</p>
          <button type="button" style={{ backgroundColor: '#87e4e4',color:'black'}}className="btn btn-primary" onClick={handleStart}>Get Started</button>
        </div>
      </div>
      <div className="section impact-section">
        <div className='float-child'>
          <img src={NegativeImpact} alt="Negative Impact" />
        </div>
        <div className='float-child'>
          <h2>The Negative Impact of Imbalance</h2>
          <p>Imbalance can cause various health issues and discomfort. It’s important to identify and address it early.</p>
        </div>    
      </div>
      <div className="section impact-section">
        <div className='float-child'>
          <h2>How We Identify Imbalance</h2>
          <p>We use advanced computer vision technology to accurately detect and analyze imbalance.</p>
        </div>
        <div className='float-child'>
          <img src={ComputerVision} alt="Computer Vision" style={{width:"700px"}}/>
        </div>
      </div>
      

      <footer className="App-footer">
        <p>© 2024 Imbalance Center. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
