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

app.get('/seasons/:year/:teamName',async (req,res)=>{
    console.log(req.params.year+"  "+req.params.teamName)
    var playerData = await stats.getPlayerName(Number(req.params.year),req.params.teamName,'matches','deliveries')
    res.send(playerData);
})

app.listen(3000);
console.log('listening');