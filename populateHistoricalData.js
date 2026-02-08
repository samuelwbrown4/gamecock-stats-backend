require('dotenv').config()

const fs = require('fs');
const path = require('path');

const YEARS = [2020 , 2021 , 2022 , 2023 , 2024 , 2025];

const API_KEY = process.env.API_KEY

const BASE_URL = 'https://api.collegefootballdata.com';

async function fetchData(url){
    try{
        const response = await fetch(url , {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok){
            throw new Error(`HTTP error! status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching from ${url}:` , error.message)
        return null;
    }
}

function saveToFile(year , filename , data){
    const yearDir = path.join(__dirname , 'data' , year.toString());

    if(!fs.existsSync(yearDir)){
        fs.mkdirSync(yearDir , {recursive: true});
        console.log(`created folder for ${year}`);
    }

    const filePath = path.join(yearDir , filename);
    fs.writeFileSync(filePath , JSON.stringify(data , null , 2));
    console.log(`saved ${filename} for ${year}`);
}

async function populateAllData() {
    console.log('🚀 Starting data population...\n');
    
    for (const year of YEARS) {
        console.log(`📅 Fetching data for ${year}...`);
        
        // 1. Record Data
        const recordUrl = `${BASE_URL}/records?year=${year}&team=South%20Carolina`;
        const recordData = await fetchData(recordUrl);
        if (recordData) saveToFile(year, 'record.json', recordData);
        
        // 2. Player Stats
        const playerStatsUrl = `${BASE_URL}/stats/player/season?year=${year}&team=South%20Carolina&seasonType=regular`;
        const playerStatsData = await fetchData(playerStatsUrl);
        if (playerStatsData) saveToFile(year, 'player-stats.json', playerStatsData);
        
        // 3. Schedule
        const scheduleUrl = `${BASE_URL}/games?year=${year}&team=South%20Carolina`;
        const scheduleData = await fetchData(scheduleUrl);
        if (scheduleData) saveToFile(year, 'schedule.json', scheduleData);
        
        // 4. Weather
        const weatherUrl = `${BASE_URL}/games/weather?year=${year}&team=South%20Carolina`;
        const weatherData = await fetchData(weatherUrl);
        if (weatherData) saveToFile(year, 'weather.json', weatherData);
        
        // 5. Roster Details
        const rosterUrl = `${BASE_URL}/roster?team=south%20carolina&year=${year}`;
        const rosterData = await fetchData(rosterUrl);
        if (rosterData) saveToFile(year, 'player-details.json', rosterData);
        
         // 6. Game by Game Stats
        const gameByGameUrl = `${BASE_URL}/games/players?year=${year}&team=south%20carolina`;
        const gameByGameData = await fetchData(gameByGameUrl);
        if (gameByGameData) saveToFile(year, 'full-game-stats.json', gameByGameData);
        
        console.log(`✅ Completed ${year}\n`);
        
        // Wait 1 second between years to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('🎉 Data population complete!');
}

populateAllData();