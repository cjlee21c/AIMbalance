import React from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './result.css';
import cause1 from '../Assets/cause1.jpeg';
import chest from '../Assets/chest.jpg';
import back from '../Assets/back.jpeg';
import core from '../Assets/core.jpeg';




function ShoulderResult() {
  const location = useLocation();
  const { rightUp, leftUp, repCount } = location.state || { rightUp: 0, leftUp: 0 }; // Default value

  let message;

  if (rightUp > leftUp) {
    message = `Your left shoulder went up ${rightUp} times out of ${repCount} reps`;
  } else if (rightUp < leftUp) {
    message = `Your right shoulder went up ${leftUp} times out of ${repCount} reps`;
  } else {
    message = 'Your form was perfect gym rat!';
  }

  const navigate = useNavigate();

  const backButton = () => {
    navigate('/ShoulderLive');
  };

  const dataButton = () => {
    navigate('/Data');
  }

  return (
    <div>
      <div className='message'>
        <h1>Shoulder Press Result</h1>
        <h2>
          <button type="button" onClick={backButton} className='button'>Go check again</button>
          {message}  
          <button type="button" onClick={dataButton}className='data'>Go check your data</button> 
        </h2>
      </div>
      <div className="container">
        <div className="info-box">      
          <p>Potential Cause 1: </p>
          <p2>Tightness of Pectorails minor and Middle, Lower trapezius</p2>
          <div className='musclePic'>
            <img src={chest} alt="Description 2" className="musclePic1"/>
            <img src={back} alt="Description 2" className="musclePic2"/>
          </div>
          <ul>
            <li>Tightness of these muscle groups might limit your shoulder range of motion</li>
            <li>Since pectorails mionr is under the pectorails major, intensifying the level of stretch before work out is necessary</li>
            <li>It affects the motion of shoulder and chest, and will also lead to asymmetry in height of both sides </li>
            <li>
              Stretch your Pec minor! <br />
              <a href="https://www.youtube.com/watch?v=SR5JeNEYneY" target="_blank" rel="noopener noreferrer">
                Watch this YouTube video
              </a>
            </li>
            <li>
              Strengthen your middle trapezius! <br />
              <a href="https://www.youtube.com/watch?v=Iq6JOdfiL5E" target="_blank" rel="noopener noreferrer">
                Watch this YouTube video
              </a>
            </li>
          </ul>
        </div>
        <div className="info-box">
          <p>Potential Cause 2</p>
          <p1>Scapulae's imbalance</p1>         
            <img src={cause1} alt="Description 1" className="info-image"/>         
          <ul>
            <li>"When you push or pull something, both shoulder blades always move together. 
              This means that if there is an imbalance in the shoulder blades, 
              the weight load on each hand will be different when pushing or pulling with your hands which natually cause difference of height of your wrists</li>
            <li>Imbalance of Scapulae are highly correlated with cause 1 (pectorails and trapezius). </li>
            <li>If you fix cause 1 issue, this issue might be fixed easily accordingly.</li>
            <li> Fix your Scapulae
              <a href="https://www.youtube.com/watch?v=VCPp1DUypo0" target="_blank" rel="noopener noreferrer">
                Watch this YouTube video
              </a>
            </li>
          </ul>
        </div>
        <div className="info-box">    
          <p>Potential cause 3</p>
          <p1>Lack of core strength</p1>
          <img src={core} alt="Description 1" className="info-image"/>         
          <ul>
            <li>Core strength plays crucial roles in maintaining stability and balance. </li>
            <li>Strong core muscles support the spine, 
              help maintain proper posture, and enable efficient force transfer during everyday movements and exercises.</li>
            <li>Fixing imbalance with unstable core is IMPOSSIBLE</li>
            <li> Importance of core strength
              <a href="https://www.youtube.com/watch?v=N3vFbzdGwIo" target="_blank" rel="noopener noreferrer">
                Watch this YouTube video
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ShoulderResult;
