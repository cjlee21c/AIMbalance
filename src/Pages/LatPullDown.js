import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './styles.css';
import calculateAngle from './calculateAngle.js';

Chart.register(...registerables);

function LatPullDownLive() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [detector, setDetector] = useState(null);
    const alertRef = useRef(null);
    const [comment, setComment] = useState('');
    const [repCount, setRepCount] = useState(0);
    const [shoulderWarning, setShoulderWarning] = useState(null);
    const [wristWarning, setWristWarning] = useState(null);
    const [rightUp, setRightUp] = useState(0);
    const [leftUp, setLeftUp] = useState(0);
    const [leftWristYData, setLeftWristYData] = useState([]);
    const [rightWristYData, setRightWristYData] = useState([]);

    //Since useState is asynchronous, useRef is more efficient
    //Since Keypoints are detected by every movement, 
    //rerendering everytime that value is changed takes up too much time
    const leftDetectRef = useRef(false);
    const rightDetectRef = useRef(false);

    const navigate = useNavigate();

    //pass the state containing 'rightUp' and 'leftUp' counts to LatPullDownResult.js file
    //LatPullDownResult.js will get state through useLocation
    const handleResultCheck = () => {
        navigate('/LatPullDownResult', { state: { rightUp, leftUp, repCount} });
    };

    let repCheck = 0;

    const updateComment = (newComment) => {
        setComment(newComment);
    };

    const updateShoulderWarning = (newShoulderWarning) => {
        setShoulderWarning(newShoulderWarning);
        setTimeout(() => {
            setShoulderWarning(null);
        }, 2000);
    };

    const updateWristWarning = (newWristWarning) => {
        setWristWarning(newWristWarning);
        setTimeout(() =>{
            setWristWarning(null);
        }, 2000);
    };
    
    //For reset button function
    const reset = () => {
        setRepCount(0);
        setRightUp(0);
        setLeftUp(0);
        setLeftWristYData([]);
        setRightWristYData([]);
    };

    useEffect(() => {
        const loadModel = async () => {
            const modelDetector = await window.poseDetection.createDetector(window.poseDetection.SupportedModels.MoveNet, {
                modelType: window.poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
            });
            setDetector(modelDetector);
        };
        loadModel();
    }, []);

    useEffect(() => {
        let animationFrameId;

        const setupCamera = async () => {
            const video = videoRef.current;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    resolve(video);
                };
            });
        };

        const detectPose = async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (video.readyState === 4 && detector) {
                const poses = await detector.estimatePoses(video);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (poses.length > 0) {
                    const keypoints = poses[0].keypoints;
                    const keyPointsToExclude = [0, 1, 2, 3, 4];
                    keypoints.forEach((point, index) => {
                        if (point.score > 0.5 && !keyPointsToExclude.includes(index)) {
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 5);
                            gradient.addColorStop(0, 'red');
                            gradient.addColorStop(1, 'yellow');
                            ctx.fillStyle = gradient;
                            ctx.fill();
                        }
                    });
                    
                    //Getting key points
                    const leftShoulder = keypoints[5];
                    const leftElbow = keypoints[7];
                    const leftHip = keypoints[11];
                    const rightShoulder = keypoints[6];
                    const rightElbow = keypoints[8];
                    const rightHip = keypoints[12];

                    const leftWrist = keypoints[9];
                    const rightWrist = keypoints[10];

                    
                    if (leftWrist.score > 0.3 && rightWrist.score > 0.3) {
                        const leftArmAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
                        const rightArmAngle = calculateAngle(rightHip, rightShoulder, rightElbow);

                        const startAngle = 60;
                        const endAngle = 140;

                        const leftShoulderColor = interpolateColor(leftArmAngle, startAngle, endAngle);
                        const rightShoulderColor = interpolateColor(rightArmAngle, startAngle, endAngle);

                        ctx.beginPath();
                        ctx.arc(leftShoulder.x, leftShoulder.y, 10, 0, 2 * Math.PI); // 어깨 키포인트 크기 증가
                        ctx.fillStyle = leftShoulderColor;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(rightShoulder.x, rightShoulder.y, 10, 0, 2 * Math.PI); // 어깨 키포인트 크기 증가
                        ctx.fillStyle = rightShoulderColor;
                        ctx.fill();

                        keypoints.forEach((point, index) => {
                            if (point.score > 0.5 && !keyPointsToExclude.includes(index)) {
                                ctx.beginPath();
                                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                                ctx.fillStyle = 'red'; 
                                ctx.fill();
                            }
                        });

                        if (leftArmAngle >= endAngle && rightArmAngle >= endAngle) {
                            repCheck = 0; // When arms are straight
                        } else if (leftArmAngle <= startAngle && rightArmAngle <= startAngle && repCheck === 0) {
                            setRepCount(prevCount => prevCount + 1);
                            repCheck = 1; // When arms are bent
                        }

                        const leftShoulderY = keypoints[5].y;
                        const rightShoulderY = keypoints[6].y;
                        const leftWristY = keypoints[9].y;
                        const rightWristY = keypoints[10].y;
                        
                        //Getting wrist Y data to make line graph
                        //Using slice method to limit the data shown in the graph
                        //also limiting amount of data
                        setLeftWristYData(prevData => [...prevData, leftWristY].slice(-100));
                        setRightWristYData(prevData => [...prevData, rightWristY].slice(-100));


                        const shoulderDifference = Math.abs(leftShoulderY - rightShoulderY);
                        const wristDifference = Math.abs(leftWristY - rightWristY);

                        if (shoulderDifference > 20 && leftShoulderY > rightShoulderY && !rightDetectRef.current) {
                            updateShoulderWarning('Your right shoulder is up!');
                            
                            setLeftUp(prevCount => prevCount + 1);
                            rightDetectRef.current = true;
                            setTimeout(() => {
                                rightDetectRef.current = false;
                            }, 3000); 
                        } else if (shoulderDifference > 20 && leftShoulderY < rightShoulderY && !leftDetectRef.current) {
                            updateShoulderWarning('Your left shoulder is up!');
                            
                            setRightUp(prevCount => prevCount + 1);
                            leftDetectRef.current = true;
                            setTimeout(() => {
                                leftDetectRef.current = false;
                            }, 3000);  
                        } else if (wristDifference > 40 && leftWristY > rightWristY && !rightDetectRef.current) {
                            updateWristWarning('Your right wrist is up');
                            
                            setLeftUp(prevCount => prevCount + 1);
                            rightDetectRef.current = true;
                            setTimeout(() => {
                                rightDetectRef.current = false;
                            }, 3000); 
                        } else if (wristDifference > 40 && leftWristY < rightWristY && !leftDetectRef.current) {
                            updateWristWarning('Your left wrist is up');
                            
                            setRightUp(prevCount => prevCount + 1);
                            leftDetectRef.current = true;
                            setTimeout(() => {
                                leftDetectRef.current = false;
                            }, 3000);
                        } else {
                            updateComment('Successfully checking your form!!');
                        }
                    } else {
                        updateComment('Place your full upper body in camera');
                    }


                    const pointsPairs = window.poseDetection.util.getAdjacentPairs(window.poseDetection.SupportedModels.MoveNet);
                    pointsPairs.forEach(([i, j]) => {
                        const kp1 = keypoints[i];
                        const kp2 = keypoints[j];
                        if (kp1.score > 0.4 && kp2.score > 0.4 && !keyPointsToExclude.includes(i) && !keyPointsToExclude.includes(j)) {
                            ctx.beginPath();
                            ctx.moveTo(kp1.x, kp1.y);
                            ctx.lineTo(kp2.x, kp2.y);
                            ctx.lineWidth = 3;
                            const gradient = ctx.createLinearGradient(kp1.x, kp1.y, kp2.x, kp2.y);
                            gradient.addColorStop(0, 'blue');
                            gradient.addColorStop(1, 'cyan');
                            ctx.strokeStyle = gradient;
                            ctx.stroke();
                        }
                    });
                }
            }
            animationFrameId = requestAnimationFrame(detectPose);
        };

        if (isCameraOn) {
            setupCamera().then(() => {
                videoRef.current.play();
                detectPose();
            });
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isCameraOn, detector]);


    const interpolateColor = (angle, minAngle, maxAngle) => {
        const ratio = Math.min(Math.max((angle - minAngle) / (maxAngle - minAngle), 0), 1);
        const r = Math.round(255 * (1 - ratio)); 
        const g = Math.round(255 * (1 - ratio));
        const b = 255;
        return `rgb(${r}, ${g}, ${b})`;
    };

    const data = {
        labels: Array.from({ length: leftWristYData.length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Left Wrist Y',
                data: leftWristYData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Right Wrist Y',
                data: rightWristYData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
        ],
    };

return (
    <div className='main'>
        <div className="video-container">
            <video ref={videoRef} width="640" height="480" className="video-style" style={{ display: 'none' }} />
            <canvas ref={canvasRef} width="640" height="480" className='canvas-style' />
            <button onClick={() => setIsCameraOn(!isCameraOn)} className='camera-button'>
                {isCameraOn ? 'Stop Checking' : 'Start Checking'}
            </button>
            <div className='info-container'>
                <div className='comment-rep-container'>
                    <div className='comment-container'>
                        {comment}
                    </div>
                    <div className='rep-container'>
                        Rep: {repCount}
                    </div>
                    <button onClick={reset} className='reset-button'>
                    Reset
                    </button>
                </div>                               
                
                </div> 
        </div>
        <div className="right-container">   
            <h1>Check your lat pull down</h1>
            <h2 className='h2'>Shoulder</h2>    
            <div className="shoulderWarning-container">
                {shoulderWarning}
            </div>
            <h2 className='h2'>Wrist</h2>
            <div className='wristWarning-container'>
                {wristWarning}
            </div>
            <div>
                {rightUp}
                
                {leftUp}
            </div>
            <div className='graph-container'>
                <Line className='graph'
                data={data}></Line>
            </div>
            <button type = 'button' className='result-button' onClick={handleResultCheck}>
                Go Check result
            </button>
        </div>
    </div>
);
}

export default LatPullDownLive;
