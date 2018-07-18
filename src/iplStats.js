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

//getting the player name
function getPlayerName(year, team, matches, deliveries) {
    return new Promise((resolve, reject) => {
        testConnection('iplData').then(async function (conn, err) {
            if (err) reject(err);
            var dbColln = await conn.collection(matches);
            var playerName = await dbColln.aggregate([{
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
            // console.log(playerName.map(a => a._id.player))
            resolve(playerName.map(a => a._id.player))
        })
    })
}

//getting the player boundaries
function getPlayerBoundaries(year, player, matches, deliveries) {
    return new Promise((resolve, reject) => {
        testConnection('iplData').then(async function (conn, err) {
            if (err) reject(err);
            var dbColln = await conn.collection(matches);
            var playerBoundaries = await dbColln.aggregate([{
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
                        playerName: "$playerDetails.batsman",
                        playerRuns: "$playerDetails.batsman_runs"
                    }
                },
                {
                    $match: {
                        playerName: player
                    }
                },
                {
                    $group: {
                        '_id': '$playerName',
                        'boundaries': {
                            $sum: {
                                $cond: {
                                    if: {
                                        $gt: ['$playerRuns', 3]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        }
                    }
                }
            ]).toArray()
            // console.log(playerBoundaries.map(a => a.boundaries))
            resolve(playerBoundaries.map(a => a.boundaries))

        })
    })
}

module.exports = {
    getSeason,
    getTeamName,
    getPlayerName,
    getPlayerBoundaries
}


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
            playerRuns: "$playerDetails.batsman_runs"
        }
    },
    {
        $match: {
            playerName: 'LMP Simmons'
        }
    },
    {
        $group: {
            '_id': '$playerName',
            count: {
                $sum: {
                    $cond: {
                        if: {
                            $gt: ['$playerRuns', 3]
                        },
                        then: 1,
                        else: 0
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