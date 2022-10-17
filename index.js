require("dotenv").config()
const express = require('express');
const app = express()
const logger = require('morgan')
const cors = require("cors")
const authorizer = require("./middleware/authorizer")
const fetch = require('node-fetch')

app.use(logger('dev'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/latest_video', authorizer, async(req, res) => {
    const {channel_id} = req.query; 

    if(!channel_id) {
        return res.status(400).json({error: "channel_id is required!"})
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel_id}&maxResults=1&order=date&type=video&key=${process.env.GOOGLE_API_KEY}`;

    const r = await fetch(url, {
        method: 'GET'
    })

    const data = await r.json()
    return res.json({last_video_id: data.items[0].id.videoId})

})


const PORT = process.env.PORT || 5081

app.listen(PORT, () => {
    console.log("[^] Server started on PORT: "+PORT)
})
