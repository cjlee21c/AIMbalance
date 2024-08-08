import { useNavigate } from 'react-router-dom';

function SquatLive() {
  const Navigate = useNavigate();

  const handleShoulderLive = () => {
    Navigate('/ShoulderLive')
  }
  
  const handleLatPullDown = () => {
    Navigate('/LatPullDown')
  }
  
  
  return (
      <div className="Mode">
        
        <h1 className='welcome'>Welcome to Live Checking Session</h1>
        <div className="workout-button">
          <button type= 'button' className="shoulder-button" onClick={handleShoulderLive}>
            Shoulder Press
          </button>
          <button type = 'button' className='LatPullDown' onClick={handleLatPullDown}>
            Lat Pull Down
          </button>
          <button>
            Squat
          </button>          
        </div>
      </div>
    );
  }
  
  export default SquatLive;
  