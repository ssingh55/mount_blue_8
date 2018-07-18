$('#seasons p').on('click', function () {
    fetch('/seasons')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            var jsonData = myJson;
            if (($('#seasons').find('li').length) == 0) {
                $('#seasons').append('<ul></ul>');
                 $('#seasons ul').addClass="dropdown-content"
                jsonData.forEach((data) => {
                    $('#seasons ul').append('<li id="' + data + '">' + data + '</li>');
                    $('#' + data.substring(0,3)).addClass="dropdown";
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
                var jsonData = myJson;
                if ($('#' + yearDetails).find('li').length == 0) {
                    $('#' + yearDetails).append('<ul></ul>');
                    $('#' + yearDetails + ' ul').addClass="dropdown-content"
                    jsonData.forEach((data) => {
                        $('#' + yearDetails + ' ul').append('<li id="'+data.substring(0,3)+'">' + data + '</li>');
                        $('#' + data.substring(0,3)).addClass="dropdown";
                        playerName(yearDetails,data)
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
            var jsonData = myJson;
            $('#'+teamName.substring(0,3)).append('<ul></ul>');
            $('#'+teamName.substring(0,3)+' ul').addClass="dropdown-content"
            jsonData.forEach((data)=>{
                $('#'+teamName.substring(0,3)+' ul').append('<li id="'+data.substring(0,3)+'">'+data+'</li>');
                $('#' + data.substring(0,3)).addClass="dropdown";
            })
        })
    })
}