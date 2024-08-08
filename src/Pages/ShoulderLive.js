import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useRecoilValue } from 'recoil';
import { usernameStateAtom } from '../atoms.js';
import { getShoulderLiveLineChartConfig, shoulderLiveLineChartOptions } from './chartConfig';
import { usePoseDetection } from './usePoseDetection';
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

  const handleResultCheck = () => {
    navigate('/ShoulderResult', { state: { rightUp, leftUp, repCount } });
  };

  const reset = () => {
    setRepCount(0);
    setRightUp(0);
    setLeftUp(0);
  };

  const handleSave = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: globalUsername,
        leftUp,
        rightUp,
        repCount,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('workout Data storing failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Done successfully: ', data);
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
      });

    navigate('/Data');
  };

  const labels = Array.from({ length: leftWristYData.length }, (_, i) => i + 1);
  const lineChartData = getShoulderLiveLineChartConfig(labels, leftWristYData, rightWristYData);
  
  console.log('Generated labels:', Array.from({ length: leftWristYData.length }, (_, i) => i + 1));
  console.log('lineChartData:', lineChartData);
  
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
        <h2 className='h2'>Shoulder</h2>
        <div className='shoulderWarning-container'>{shoulderWarning}</div>
        <h2 className='h2'>Wrist</h2>
        <div className='wristWarning-container'>{wristWarning}</div>
        <div className='graph-container'>
          <Line className='graph' data={lineChartData} options={shoulderLiveLineChartOptions} />
        </div>
        <button type='button' className='result-button' onClick={handleResultCheck}>
          Go Check result
        </button>
        <button type='button' className='result-button' onClick={handleSave}>
          Save workoutData
        </button>
      </div>
    </div>
  );
}

export default ShoulderLive;
