const express = require('express'),
    app = express(),
    path = require('path'),
    stats = require(path.resolve('iplStats.js'));

app.use(express.static(path.resolve('../assets')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/seasons', async (req, res) => {
    var seasonData = await stats.getSeason('matches');
    // console.log(seasonData);
    res.send(seasonData);
})

app.get('/seasons/:season', async (req, res) => {
    var teamData = await stats.getTeamName(Number(req.params.season), 'matches');
    res.send(teamData);
})

app.get('/seasons/:season/teams/:teamName', async (req, res) => {
    // console.log(req.params.season+"  "+req.params.teamName)
    var playerData = await stats.getPlayerName(Number(req.params.season), req.params.teamName, 'matches', 'deliveries')
    res.send(playerData);
})

app.get('/seasons/:season/teams/:teamName/players/:player', async (req, res) => {
    // console.log(req.params.season+"  "+req.params.teamName)
    var playerData = await stats.getPlayerBoundaries(Number(req.params.season), req.params.player, 'matches', 'deliveries')
    res.send(playerData);
})

app.listen(3000);
console.log('listening');