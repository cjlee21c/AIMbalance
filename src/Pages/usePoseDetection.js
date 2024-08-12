import { useEffect, useRef, useState } from 'react';
import calculateAngle from './calculateAngle';

export function usePoseDetection(isCameraOn, setComment, setRepCount, setShoulderWarning, setWristWarning, setLeftUp, setRightUp,setLeftWristYData, setRightWristYData) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [detector, setDetector] = useState(null);
  const leftDetectRef = useRef(false);
  const rightDetectRef = useRef(false);
  let repCheck = 0;

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

    const drawPoint = (ctx, x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 5);
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(1, 'yellow');
      ctx.fillStyle = gradient;
      ctx.fill();
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
              drawPoint(ctx, point.x, point.y);
            }
          });

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

            const startAngle = 70;
            const endAngle = 140;


            const interpolateColor = (angle, minAngle, maxAngle) => {
              const ratio = Math.min(Math.max((angle - minAngle) / (maxAngle - minAngle), 0), 1);
              const r = Math.round(255 * (1 - ratio)); 
              const g = Math.round(255 * (1 - ratio));
              const b = 255;
              return `rgb(${r}, ${g}, ${b})`;
            };

            const leftShoulderColor = interpolateColor(leftArmAngle, startAngle, endAngle);
            const rightShoulderColor = interpolateColor(rightArmAngle, startAngle, endAngle);

            ctx.beginPath();
            ctx.arc(leftShoulder.x, leftShoulder.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = leftShoulderColor;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(rightShoulder.x, rightShoulder.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = rightShoulderColor;
            ctx.fill();

            keypoints.forEach((point, index) => {
              if (point.score > 0.5 && !keyPointsToExclude.includes(index)) {
                drawPoint(ctx, point.x, point.y);
              }
            });

            if (leftArmAngle <= startAngle && rightArmAngle <= startAngle) {
              repCheck = 0;
            } else if (leftArmAngle >= endAngle && rightArmAngle >= endAngle && repCheck === 0) {
              setRepCount(prevCount => prevCount + 1);
              repCheck = 1;
            }

            const leftShoulderY = keypoints[5].y;
            const rightShoulderY = keypoints[6].y;
            const leftWristY = keypoints[9].y;
            const rightWristY = keypoints[10].y;

            setLeftWristYData(prevData => [...prevData, leftWristY].slice(-100));
            setRightWristYData(prevData => [...prevData, rightWristY].slice(-100));

            const shoulderDifference = Math.abs(leftShoulderY - rightShoulderY);
            const wristDifference = Math.abs(leftWristY - rightWristY);

            if (shoulderDifference > 20 && leftShoulderY > rightShoulderY && !rightDetectRef.current) {
              setShoulderWarning('Your right shoulder is up!');
              setLeftUp(prevCount => prevCount + 1);
              rightDetectRef.current = true;
              setTimeout(() => { rightDetectRef.current = false; }, 3000);
            } else if (shoulderDifference > 20 && leftShoulderY < rightShoulderY && !leftDetectRef.current) {
              setShoulderWarning('Your left shoulder is up!');
              setRightUp(prevCount => prevCount + 1);
              leftDetectRef.current = true;
              setTimeout(() => { leftDetectRef.current = false; }, 3000);
            } else if (wristDifference > 50 && leftWristY > rightWristY && !rightDetectRef.current) {
              setWristWarning('Your right wrist is up');
              setLeftUp(prevCount => prevCount + 1);
              rightDetectRef.current = true;
              setTimeout(() => { rightDetectRef.current = false; }, 3000);
            } else if (wristDifference > 50 && leftWristY < rightWristY && !leftDetectRef.current) {
              setWristWarning('Your left wrist is up');
              setRightUp(prevCount => prevCount + 1);
              leftDetectRef.current = true;
              setTimeout(() => { leftDetectRef.current = false; }, 3000);
            } else {
              setComment('Successfully checking your form!!');
            }
          } else {
            setComment('Place your full upper body in camera');
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

  return { videoRef, canvasRef };
}
