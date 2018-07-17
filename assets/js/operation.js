$('#seasons p').on('click', function () {
    fetch('/seasons')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            var jsonData = myJson;
            if (($('#seasons').find('li').length) == 0) {
                $('#seasons').append('<ul></ul>');
                jsonData.forEach((data) => {
                    $('#seasons ul').append('<li id="' + data + '">' + data + '</li>');
                    teamName(data);
                })
            } else {
                $('#seasons ul').remove();
            }
        })
})

function teamName(yearDetails) {
    $('#' + yearDetails).on('click', function () {
        // console.log(yearDetails)
        fetch('/seasons/' + yearDetails)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                var data = myJson;
                if ($('#' + yearDetails).find('li').length == 0) {
                    $('#' + yearDetails).append('<ul></ul>');
                    data.forEach((data) => {
                        $('#' + yearDetails + ' ul').append('<li>' + data + '</li>');
                    })
                } else {
                    $('#' + yearDetails + ' ul').remove();
                }
            })
    })
}