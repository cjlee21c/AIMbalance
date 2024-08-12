import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './Data.css';
import './result.css';
import { sectionTextPlugin, backgroundColorPlugin } from './chartPlugins';
import { getDoughnutChartConfig, getLineChartConfig, lineChartOptions, doughnutOptions } from './chartConfig';
import { TbArrowBigDownFilled } from "react-icons/tb";
import cause1 from '../Assets/cause1.jpeg';
import chest from '../Assets/chest.jpg';
import back from '../Assets/back.jpeg';
import core from '../Assets/core.jpeg';
import { fetchSuccessRate } from '../apiRequests';

function Data() {
  const [averageRate, setAverageRate] = useState(0);
  const [averageLeftUpRate, setAverageLeftUpRate] = useState(0);
  const [averageRightUpRate, setAverageRightUpRate] = useState(0);
  const [recentData, setRecentData] = useState({ leftUp: 0, rightUp: 0, repCount: 0 });
  const [lineChartData, setLineChartData] = useState(null);
  
  const successRate = Math.round(((recentData.repCount - (recentData.leftUp + recentData.rightUp)) / recentData.repCount) * 100);

  
  useEffect(() => {
    fetchSuccessRate()
      .then(response => {
      const data = response; // response.data 대신 response 자체를 사용
      const averageRate = data.averageRate || 0;
      const averageLeftUpRate = data.averageLeftUpRate || 0;
      const averageRightUpRate = data.averageRightUpRate || 0;
      const recentData = data.recentData || { leftUp: 0, rightUp: 0, repCount: 0 };
      const successReps = recentData.repCount - (recentData.leftUp + recentData.rightUp);

      
      animateValue(setAverageRate, averageRate, 2000);
      animateValue(setAverageLeftUpRate, averageLeftUpRate, 2000);
      animateValue(setAverageRightUpRate, averageRightUpRate, 2000);
      setRecentData({ ...recentData, successReps });

      const successRates = data.successRates || [];
      const leftUpRates = data.leftUpRates || [];
      const rightUpRates = data.rightUpRates || [];
      const dates = (data.dates || []).map(date => new Date(date).toLocaleDateString());

      const chartData = getLineChartConfig(dates, successRates, leftUpRates, rightUpRates);
      setLineChartData(chartData);
    })
    .catch(error => console.error("Error fetching success rate:", error));
  }, []);

  const animateValue = (setValue, end, duration) => {
    let start = 0;
    const range = end - start;
    let current = start;
    const increment = range / (duration / 50);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setValue(end);
      } else {
        setValue(Math.round(current));
      }
    }, 30);
  };

  const navigate = useNavigate();
  
  const backButton = () => {
    navigate('/ShoulderLive');
  };

  return (
    <div className="Mode">
      <div className='rateData-container'>
        <div className='data-item'>
          <p>Average success rate:</p>         
          <span className='highlight-number'>{averageRate}%</span>
        </div>
        <div className='data-item'>
          <p>Average right up rate:</p>
          <span className='highlight-number'>{averageLeftUpRate}%</span>
        </div>
        <div className='data-item'>
          <p >Average left up rate:</p>
          <span className='highlight-number'>{averageRightUpRate}%</span>
        </div>
      </div>
      <div className='chart-container'>
        <div className='doughnutChart-container'>
          <h1 style={{paddingLeft: '50px'}}>Your latest session</h1>
          <Doughnut
            data={getDoughnutChartConfig(recentData)}
            options={doughnutOptions}
            plugins={[sectionTextPlugin, backgroundColorPlugin]}
            style={{borderRadius:'30px'}}
          />
          <div className='doughnutChart-text'>
            <p style={{fontSize: '15px'}}>Success Rate:</p>
            <span style={{fontSize:'55px', color:''}}>{successRate}%</span>           
          </div>
        </div>
        {lineChartData && (
          <div className='lineChart-container'>
            <div className='line-chart-wrapper'>
              <Line data={lineChartData} options={lineChartOptions} style={{width:'100%'}}/>
            </div>           
          </div>
        )}
      </div> 
      <div className='arrow-container'>
        <div className='arrow'>  
          <TbArrowBigDownFilled style={{fontSize:'80px', paddingTop:'10px',color:'blue'}}/> 
          <h1 style={{color:'green', fontWeight:'bold'}}>Potential causes</h1>
          
        </div>
      </div> 
      <div>
      <div className="container">        
        <div className="info-box">      
          <p>Potential Cause 1: </p>
          <p1 style={{paddingLeft:'30px'}}>Tightness of Pectorails minor and Middle, Lower trapezius</p1>
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
      <div className="button-container">
        <button type="button" onClick={backButton} className='button'>Go check again</button>
      </div>      
    </div>          
    </div>
      
  );
}

export default Data;


