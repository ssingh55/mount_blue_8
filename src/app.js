const express = require('express'),
    app = express(),
    path = require('path'),
    stats = require(path.resolve('iplStats.js'));

app.use(express.static(path.resolve('../assets')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/seasons',async (req,res)=>{
    var seasonData = await stats.getSeason('matches');
    // console.log(seasonData);
    res.send(seasonData);
})

app.get('/seasons/:year',async (req,res)=>{
    var teamData = await stats.getTeamName(Number(req.params.year),'matches');
    res.send(teamData);
})

app.listen(3000);
console.log('listening');