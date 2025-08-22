const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Weather API
app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1ece454c1b26762f6736ce51144f76b2&units=metric`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Weather data not available' });
    }
});

// Random Cat Fact API
app.get('/api/catfact', async (req, res) => {
    try {
        const response = await axios.get('https://catfact.ninja/fact');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Cat fact not available' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3005, () => {
    console.log('Free API Integration running on http://localhost:3005');
});