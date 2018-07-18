$('#seasons p').on('click', function () {
    $.ajax({
        url: '/seasons',
        type: 'GET',
        data: '/seasons',
        success: function (myJson) {
            var jsonData = myJson;
            if (($('#seasons').find('li').length) == 0) {
                $('#seasons').append('<ul></ul>');
                $('#seasons ul').addClass("dropdown-content")
                jsonData.forEach((data) => {
                    $('#seasons ul').append('<li id="' + data + '"><span>' + data + '</span></li>');
                    // .attr('id',data)
                    $('#' + data).addClass("dropdown");
                    teamNameDetails(data);
                })
            } else {
                $('#seasons ul').remove();
            }
        }
    })
})

function teamNameDetails(yearDetails) {
    $('#' + yearDetails + ' span').on('click', function () {
        $.ajax({
            url: '/seasons/' + yearDetails,
            type: 'GET',
            data: '/seasons/' + yearDetails,
            success: function (myJson) {
                var jsonData = myJson;
                if ($('#' + yearDetails).find('li').length == 0) {
                    $('#' + yearDetails).append('<ul></ul>');
                    $('#' + yearDetails + ' ul').addClass("dropdown-content")
                    jsonData.forEach((data) => {
                        $('#' + yearDetails + ' ul').append('<li id="' + data.substring(0, 3) + '"><span>' + data + '</span></li>');
                        $('#' + data.substring(0, 3)).addClass("dropdown");
                        playerName(yearDetails, data)
                    })
                } else {
                    $('#' + yearDetails + ' ul').remove();
                }
            }
        })
    })
}

function playerName(year, teamName) {
    // console.log(year, teamName)
    $('#' + teamName.substring(0, 3) + ' span').on('click', function () {
        fetch('/seasons/' + year + "/teams/" + teamName)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                // console.log(myJson)
                var jsonData = myJson;
                if ($('#' + teamName.substring(0, 3)).find('li').length == 0) {
                    $('#' + teamName.substring(0, 3)).append('<ul></ul>');
                    $('#' + teamName.substring(0, 3) + ' ul').addClass("dropdown-content")
                    jsonData.forEach((data) => {
                        $('#' + teamName.substring(0, 3) + ' ul').append('<li id="' + data.replace(/ /g, "_") + '"><span>' + data + '</span></li>');
                        $('#' + data.replace(/ /g, "_")).addClass("dropdown");
                        playerBoundaries(year, teamName, data)
                    })
                } else {
                    $('#' + teamName.substring(0, 3) + ' ul').remove();
                }
            })
    })
}

function playerBoundaries(year, teamName, playerName) {
    $('#' + playerName.replace(/ /g, "_") + ' span').on('click', function () {
        $.ajax({
            url: '/seasons/' + year + '/teams/' + teamName + '/players/' + playerName,
            type: 'GET',
            data: '/seasons/' + year + '/teams/' + teamName + '/players/' + playerName,
            success: function (myJson) {
                // console.log('hello')
                var jsonData = myJson;
                if ($('#' + playerName.replace(/ /g, "_")).find('li').length == 0) {
                    $('#' + playerName.replace(/ /g, "_")).append('<ul></ul>');
                    $('#' + playerName.replace(/ /g, "_") + ' ul').addClass("dropdown-content")
                    jsonData.forEach((data) => {
                        $('#' + playerName.replace(/ /g, "_") + ' ul').append('<li id="' + data + '"><span>Total boundaries score : ' + data + '</span></li>');
                        $('#' + data).addClass("dropdown");
                    })
                } else {
                    $('#' + playerName.replace(/ /g, "_") + ' ul').remove();
                }
            }
        })
    })
}