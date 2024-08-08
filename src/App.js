// src/Routing.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLoggedInStateAtom, usernameStateAtom } from './atoms';
import SquatLive from './Pages/Squat'
import Select from './Pages/Select'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Navigation from './Navigation';
import ShoulderLive from './Pages/ShoulderLive';
import LatPullDown from './Pages/LatPullDown';
import ShoulderResult from './Pages/ShoulderResult';
import Signup from './Pages/Signup';
import Data from './Pages/Data';



function App() {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInStateAtom);
    const setGlobalUsername = useSetRecoilState(usernameStateAtom);
    const navigate = useNavigate();

    useEffect(() =>{
        const loggedIn = localStorage.getItem('isLoggedIn');
        const savedUsername = localStorage.getItem('username');
        if (loggedIn && savedUsername) {
            setIsLoggedIn(true);
            setGlobalUsername(savedUsername);
        }
    },[setIsLoggedIn, setGlobalUsername]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setGlobalUsername('');
        navigate('/login');
    };

    return (    
            <div className="App">
                <Navigation isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/select' element={<Select />}></Route>
                    <Route path='/Squat' element={<SquatLive />}></Route>
                    <Route path='/ShoulderLive' element={<ShoulderLive />}></Route>  
                    <Route path='/LatPullDown' element={<LatPullDown />}></Route>         
                    <Route path='/Login' element={<Login />}></Route>
                    <Route path='/ShoulderResult' element={<ShoulderResult />}></Route>
                    <Route path='/Signup' element={<Signup />}></Route>
                    <Route path='/Data' element={<Data />}></Route>

                </Routes>
            
            </div>

        
    )
}


export default App;