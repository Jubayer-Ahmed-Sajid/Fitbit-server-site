const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const port = process.env.PORT || 5000;
const app = express();
const axiosSecure = require('./axiosSecure')
app.use(express.json());
app.use(cors());

const querystring = require('querystring');

app.get("/", (req, res) => {
    res.send("Fitbit is running...");
});

const clientId = '23RMXW';
const clientSecret = 'c761a7e0676e522c105a94ab105c9f27';
const redirectUri = 'http://localhost:5173';

app.get('/authorize', (req, res) => {
    const authorizeUrl = 'https://www.fitbit.com/oauth2/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'activity profile',
            state: '41c9f028be1b36f726b49e7d0d563639',
        });

    res.send({ auth: authorizeUrl });
});

app.post('/callback', async (req, res) => {
    const code = req.body.exchangeCode;

    console.log('exchange code',code)

    const tokenUrl = 'https://api.fitbit.com/oauth2/token';
  
  
    try {
        console.log('the code is',code)
        const postData = new URLSearchParams();
        postData.append('code', code);
        postData.append('grant_type', 'authorization_code');
        postData.append('redirect_uri', redirectUri);
        const tokenResponse = await axiosSecure.post(tokenUrl, postData,
            );
        const tokenData = tokenResponse.data;
        console.log("token data is", tokenData)

        res.send({ accessToken: tokenData.access_token })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(port, () => {
    console.log(`Fitbit is Running on port ${port}`);
});
