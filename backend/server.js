const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


app.use(express.json());
//using credentials: true, allowing sending cookie through true
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());
const SECRET_KEY = process.env.SECRET_KEY || 'hello';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MUisbtch8930!',
    database: 'imbalance',
});

const queryAsync = promisify(db.query).bind(db);

app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        console.log("Validation error: missing fields");
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log("Received signup request with data:", { username, password, email });

    try {       
        //Checking if username exists
        const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
        const results = await queryAsync(checkUserQuery, [username]);
        
        if (results.length > 0) {
            console.log("Username already exists");
            return res.status(400).json({ message: "Username already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUserQuery = 'INSERT INTO users (username, password, email) VALUES (?,?,?)';
            await queryAsync(insertUserQuery, [username, hashedPassword, email]);
            res.status(201).json({ message: "User register successful" });
        }
    } catch (error) {
        console.error("Error during signup: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.log("Validation error: missing fields");
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log("Received login request with data:", { username, password });

    try {
        const checkUserNameQuery = 'SELECT * FROM users where username = ?';
        const results = await queryAsync(checkUserNameQuery, [username]);

        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // 토큰 생성
                const accessToken = jwt.sign({ userId: user.id, username: user.username },
                    SECRET_KEY,
                    { expiresIn: '15m' });
                const refreshToken = jwt.sign({ userId: user.id, username: user.username },
                    SECRET_KEY,
                    { expiresIn: '7d' });

                const updateTokenQuery = 'UPDATE users SET refreshToken = ? WHERE id = ?';
                await queryAsync(updateTokenQuery, [refreshToken, user.id]);

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });

                return res.status(200).json({ message: "Login successful" });
            } else {
                return res.status(400).json({ message: "Invalid password" });
            }
        } else {
            return res.status(400).json({ message: "Username does not exist" });
        }
    } catch (error) {
        console.error("Error during login: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});



const authenticateTokens = (req, res, next) => {
    console.log('Cookies: ', req.cookies);
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

app.post('/refresh-token', async(req,res) =>{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({message: 'No refresh token provided'});

    try {
        const user = jwt.verify(refreshToken, SECRET_KEY);
        const results = await queryAsync('SELECT * FROM users WHERE id = ? AND refreshToken = ?', [user.userId, refreshToken]);
        if (results.length === 0) return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = jwt.sign({ userId: user.userId, username: user.username }, SECRET_KEY, { expiresIn: '15m' });
        console.log('Generated New AccessToken:', newAccessToken); // 새 토큰 확인
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ accessToken: newAccessToken });    
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
});


app.post('/save', authenticateTokens, async(req,res) => {
    const { rightUp, leftUp, repCount} = req.body;
    const username = req.user.username; //decoded username from JWT

    const workoutQuery = "INSERT INTO workoutData (username, rightUp ,leftUp, repCount) VALUES (?,?,?,?)";

    try{
        console.log("Attempting to save data:", { username, rightUp, leftUp, repCount });
        await queryAsync(workoutQuery, [username, rightUp,leftUp,repCount]);
        console.log("Data saved successfully");
        res.status(201).json({message: "Data saved successfully"});
    } catch (err) {
        console.error("Error while inserting Workout data: " + err.stack);
        res.status(500).json({message: "Database error"});
    }
});

app.get('/success-rate', authenticateTokens, async(req,res) =>{
    const username = req.user.username;
    const successQuery = 'select rightUp, leftUp, repCount, created_at FROM workoutData where username = ? AND repCount > 0';
    const latestDataQuery = 'select rightUp, leftUp, repCount FROM workoutData where username = ? AND repCount > 0 ORDER BY id DESC LIMIT 1';

    try{
        let successRates = [];
        let leftUpRates = [];
        let rightUpRates = [];
        let dates = [];

        const results = await queryAsync(successQuery,[username]);
        
        results.forEach(result => {
            const totalSuccessfulReps = result.repCount - (result.rightUp + result.leftUp);
            const successRate = (totalSuccessfulReps / result.repCount) * 100;
            successRates.push(successRate);

            const leftUpRate = (result.leftUp / result.repCount) * 100;
            const rightUpRate = (result.rightUp / result.repCount) * 100;
            leftUpRates.push(leftUpRate);
            rightUpRates.push(rightUpRate);
            dates.push(result.created_at);     
        });

        const averageRate = successRates.length > 0 
            ? successRates.reduce((a,b) => a + b, 0) / successRates.length
            : 0;       
        const roundedRate = Math.round(averageRate);

        const averageLeftUpRate = leftUpRates.length > 0
            ? leftUpRates.reduce((a,b) => a + b, 0) / leftUpRates.length
            : 0;
        const roundedLeftUp = Math.round(averageLeftUpRate);

        const averageRightUpRate = rightUpRates.length > 0
            ? rightUpRates.reduce((a,b) => a + b, 0) / rightUpRates.length
            : 0;
        const roundedRightUp = Math.round(averageRightUpRate);       

        const latestResults = await queryAsync(latestDataQuery, [username]);
        const latestData = latestResults.length > 0 ? latestResults[0] : null;

        res.status(200).json({ 
            averageRate: roundedRate,
            averageLeftUpRate: roundedLeftUp,
            averageRightUpRate: roundedRightUp,
            successRates: successRates,
            leftUpRates: leftUpRates,
            rightUpRates: rightUpRates,
            dates: dates,
            recentData: latestData ? {
                rightUp: latestData.rightUp,
                leftUp: latestData.leftUp,
                repCount: latestData.repCount
            } : null
        });
    
    } catch(error) {
        console.error("Error calculating success rate: ", error.stack);
        res.status(500).json({message: "Database error"});
    }
});
       




app.get('/', (req, res) => {
    res.json({ message: 'Hello from node.js server' });
});

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});
