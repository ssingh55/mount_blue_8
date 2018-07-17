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
                    data.forEach((data2) => {
                        $('#' + yearDetails + ' ul').append('<li id="'+data2.substring(0,3)+'">' + data2 + '</li>');
                        playerName(yearDetails,data2)
                    })
                } else {
                    $('#' + yearDetails + ' ul').remove();
                }
            })
    })
}

function playerName(year,teamName){
    $('#'+teamName.substring(0,3)).click(function(){
        fetch('/seasons/' + year+"/"+teamName)
        .then(function (response){
            return response.json();
        })
        .then(function (myJson){
            console.log(myJson)
            var data = myJson;
            $('#'+teamName.substring(0,3)).append('<ul></ul>');
            data.forEach((data2)=>{
                $('#'+teamName.substring(0,3)+' ul').append('<li id="'+data2.substring(0,3)+'">'+data2+'</li>')
            })
        })
    })
}