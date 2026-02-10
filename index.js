const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');
const rateLimit = require('express-rate-limit')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://gamecock-stats-app-samuelbrowns-projects-7d2fb4f1.vercel.app',
        /\.vercel\.app$/
    ],
    credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests from this IP, try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api' , limiter);

app.get('/' , (req , res) => {
    console.log('incoming request to /');
    res.json({message: 'Gamecock Stats API is up and running!'})
});


app.get('/api/record/:year' , (req , res) => {
   const year = req.params.year;
   const filePath = path.join(__dirname , 'data' , year , 'record.json');

   console.log(`request for record data, year: ${year}`);

   try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        res.json(jsonData);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(404).json({ error: `Record data for year ${year} not found` });
    }
})

app.get('/api/schedule/:year' , (req , res) => {
    const year = req.params.year;
    const filePath = path.join(__dirname , 'data' , year , 'schedule.json');

    console.log(`request for schedule data for year: ${year}`);

    try{
        const fileData = fs.readFileSync(filePath , 'utf8');
        const jsonData = JSON.parse(fileData);

        res.json(jsonData)
    } catch(error){
        console.error(`Error: ${error.message}`);
        res.status(404).json({error: `schedule data for ${year} not found`})
    }
})

app.get('/api/weather/:year' , (req , res) => {
    const year = req.params.year;
    const filePath = path.join(__dirname , 'data' , year , 'weather.json');

    console.log(`request for weather data from ${year}`);

    try{
        const fileData = fs.readFileSync(filePath , 'utf8');
        const jsonData = JSON.parse(fileData);

        res.json(jsonData);

    } catch(error){
        console.error(`Error: ${error.message}`);
        res.status(404).json({error: `weather data for ${year} not found`})
    }
});

app.get('/api/player-stats/:year' , (req , res) => {
    const year = req.params.year;
    const filePath = path.join(__dirname , 'data' , year , 'player-stats.json');

    console.log(`request for player stats from ${year}`);

    try{
        const fileData = fs.readFileSync(filePath , 'utf8');
        const jsonData = JSON.parse(fileData);

        res.json(jsonData);

    } catch(error) {
        console.error(`Error fetching player stats: ${error.message}`);

        res.status(404).json({message: `cannot fetch player stats for year ${year}`});
    }
});

app.get('/api/player-details/:year' , (req , res) => {
    const year = req.params.year;
    const filePath = path.join(__dirname , 'data' , year , 'player-details.json');

    console.log(`request for player details from ${year}`);

    try{
        const fileData = fs.readFileSync(filePath , 'utf8');
        const jsonData = JSON.parse(fileData);

        res.json(jsonData);
    
    } catch(error){
        console.error(`error fetching player-details: ${error.message}`);

        res.status(404).json({message: `error fetching player-details for ${year}`});
    }
});

app.get('/api/full-game-stats/:year' , (req , res) => {
    const year = req.params.year
    const filePath = path.join(__dirname , 'data' , year , 'full-game-stats.json');

    console.log(`request made for full-game-stats for ${year}`);

    try{
        const fileData = fs.readFileSync(filePath , 'utf8');
        const jsonData = JSON.parse(fileData);

        res.json(jsonData);
    }catch(error){
        console.log(`error fetching full-game-stats for ${year}: ${error.message}`);

        res.status(404).json({message: `error fetching full-game-stats for ${year}`})
    }
});

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on Port ${PORT}`);
});

