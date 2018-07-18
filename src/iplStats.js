const MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://127.0.0.1:27017';

//for connecting to the database
function testConnection(dbName) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, conn) {
            if (err) {
                console.log('mongo db service not started')
                reject(err);
            }
            console.log('Connection established to', url);
            var dbConnection = conn.db(dbName);
            resolve(dbConnection);
        })
    }).catch(function (e) {})
}

//getting the season data
function getSeason(matches) {
    return new Promise((resolve, reject) => {
        testConnection('iplData').then(async function (conn, err) {
            if (err) {
                console.log('error');
                reject(err);
            }
            var dbColln = await conn.collection(matches);
            var seasonData = await dbColln.distinct('season');
            // console.log(seasonData)
            resolve(seasonData.sort());
        })
    })
}

//getting the teamName
function getTeamName(year, matches) {
    return new Promise((resolve, reject) => {
        testConnection('iplData').then(async function (conn, err) {
            if (err) reject(err);
            var dbColln = await conn.collection(matches);
            var teamName = await dbColln.aggregate(
                [{
                        $match: {
                            'season': year
                        }
                    },
                    {
                        $group: {
                            '_id': '$team1'
                        }
                    }
                ]
            ).toArray()
            // console.log(teamName.map(a => a._id))
            resolve(teamName.map(a => a._id));
        })
    })
}

function getPlayerName(year, team, matches, deliveries) {
    return new Promise((resolve, reject) => {
        testConnection('iplData').then(async function (conn, err) {
            if (err) reject(err);
            console.log(year, team, matches, deliveries);
            var dbColln = await conn.collection(matches);
            var playerName = await dbColln.aggregate([
                {
                    $match: {
                        season: year
                    }
                },
                {
                    $lookup: {
                        from: deliveries,
                        localField: 'id',
                        foreignField: 'match_id',
                        as: 'playerDetails'
                    }
                },
                {
                    $unwind: '$playerDetails'
                },
                {
                    $project: {
                        myTeam: "$playerDetails.batting_team",
                        playerName: "$playerDetails.batsman"

                    }
                },
                {
                    $match: {
                        myTeam: team
                    }
                }, {
                    $group: {
                        _id: {
                            player: '$playerName'
                        }
                    }
                }
            ]).toArray()
            console.log(playerName.map(a=>a._id.player))
            resolve(playerName.map(a => a._id.player))
        })
    })
}
// getPlayerName(2017,'Royal Challengers Bangalore','matches','deliveries')

function getPlayerDetails(year, team, playerName, matches, deliveries) {

}
// getPlayerDetails(2017,'Royal Challengers Bangalore','AC Gilchrist','matches','deliveries')


/*
db.matches.aggregate([{
        $match: {
            season: 2017
        }
    },
    {
        $lookup: {
            from: 'deliveries',
            localField: 'id',
            foreignField: 'match_id',
            as: 'playerDetails'
        }
    },
    {
        $unwind: '$playerDetails'
    },
    {
        $project: {
            myTeam: "$playerDetails.batting_team",
            playerName: "$playerDetails.batsman",
            playerRuns: "$playersDetails.batsman_runs"
        }
    },
    {
        $match: {
            myTeam: 'Mumbai Indians'
        }
    },
    {
        $group: {
            '_id': '$playerName',
            count: {
                $sum: {
                    $cond: {
                        if: {
                            $gt: ['$playerRuns', 0]
                        },
                        then: 0,
                        else: 1
                    }
                }
            }
        }
    }
])
*/






/*
db.matches.aggregate([{
        $match: {
            season: 2016
        }
    },
    {
        $lookup: {
            from: 'deliveries',
            localField: 'id',
            foreignField: 'match_id',
            as: 'playerDetails'
        }
    },
    {
        $unwind: '$playerDetails'
    },
    {
        $project: {
            myTeam: "$playerDetails.batting_team",
            playerName: "$playerDetails.batsman"

        }
    },
    {
        $match: {
            myTeam: 'Mumbai Indians'
        }
    }, {
        $group: {
            _id: {
                player: '$playerName'
            }
        }
    }
]).pretty()
*/




module.exports = {
    getSeason,
    getTeamName,
    getPlayerName
}