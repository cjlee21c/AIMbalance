import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useRecoilValue } from 'recoil';
import { usernameStateAtom } from '../atoms.js';
import { getShoulderLiveLineChartConfig, shoulderLiveLineChartOptions } from './chartConfig';
import { usePoseDetection } from './usePoseDetection';
import { saveWorkoutData } from '../apiRequests.js';
import './styles.css';

Chart.register(...registerables);

function ShoulderLive() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [comment, setComment] = useState('');
  const [repCount, setRepCount] = useState(0);
  const [shoulderWarning, setShoulderWarning] = useState(null);
  const [wristWarning, setWristWarning] = useState(null);
  const [rightUp, setRightUp] = useState(0);
  const [leftUp, setLeftUp] = useState(0);
  const [leftWristYData, setLeftWristYData] = useState([]);
  const [rightWristYData, setRightWristYData] = useState([]);
  
  const globalUsername = useRecoilValue(usernameStateAtom);

  const { videoRef, canvasRef } = usePoseDetection(
    isCameraOn,
    setComment,
    setRepCount,
    setShoulderWarning,
    setWristWarning,
    setLeftUp,
    setRightUp,
    setLeftWristYData,
    setRightWristYData
  );

  const navigate = useNavigate();

  const reset = () => {
    setRepCount(0);
    setRightUp(0);
    setLeftUp(0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = await saveWorkoutData(globalUsername, leftUp, rightUp, repCount);
      console.log('Done successfully: ', data);
      navigate('/Data');
    } catch (error) {
      console.error('Error during save: ', error);
    } 
  };

  const labels = Array.from({ length: leftWristYData.length }, (_, i) => i + 1);
  const lineChartData = getShoulderLiveLineChartConfig(labels, leftWristYData, rightWristYData);
  
  useEffect(() => {
    if (shoulderWarning) {
      const timer = setTimeout(() => {
        setShoulderWarning(null);
      }, 1500);
      return () => clearTimeout(timer); 
    }
  }, [shoulderWarning]);


  useEffect(() => {
    if (wristWarning) {
      const timer = setTimeout(() => {
        setWristWarning(null);
      }, 1500);
      return () => clearTimeout(timer); 
    }
  }, [wristWarning]);
  
  
  return (
    <div className='main'>
      <div className='video-container'>
        <video ref={videoRef} width='640' height='480' className='video-style' style={{ display: 'none' }} />
        <canvas ref={canvasRef} width='640' height='480' className='canvas-style' />
        <button onClick={() => setIsCameraOn(!isCameraOn)} className='camera-button'>
          {isCameraOn ? 'Stop Checking' : 'Start Checking'}
        </button>
        <div className='info-container'>
          <div className='comment-rep-container'>
            <div className='comment-container'>{comment}</div>
            <div className='rep-container'>Rep: {repCount}</div>
            <button onClick={reset} className='reset-button'>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className='right-container'>
        <h1 className='h1'>Check your shoulder press</h1>
        
        <div className='graph-container'>
          <Line className='graph' data={lineChartData} options={shoulderLiveLineChartOptions} />
        </div>
        <div className='warning-container'>
          <h2 style={{paddingLeft:'200px'}}>Warning Center</h2>
          <div className='shoulderWarning-container'>
            {shoulderWarning}
          </div>         
          <div className='wristWarning-container' style={{marginTop:'20px'}}>
            {wristWarning}
          </div>
        </div>       
        <div style={{paddingLeft:'50px'}}>
          <button type='button' className='result-button' onClick={handleSave}>
            Save workoutData
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default ShoulderLive;
