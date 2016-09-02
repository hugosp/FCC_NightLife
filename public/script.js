$(document).ready(function(){
    $('#search').click(function(){
        $(".result").html('');
        $.get( "/api/place/"+$('#location').val(), function( data ) {
            buildList(data);
        });
    });
    
    
    $(document).on('click', '.going', function(){
        var id = $(this).attr('id')
        var addr = "/api/going/"+id;
        $.get( addr, function( data ) {
            console.log(data);
            if(data.error == true) {
                alert(data.message);
            } else {
                $('#'+id).html(data.num+' going');
            }
        });
    });
    
    
    $('#gps').click(function() {
        $(".result").html('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlon = position.coords.latitude + "," + position.coords.longitude;
                $.get( "/api/gps/"+latlon, function( data ) {
                    buildList(data);
                });
            });
        }
    });
    
});


function buildList(data) {
    var template = $('#template');
    var templateHTML = template.html();
    var newHTML = '';

    for (var key in data.businesses) {
        if(!data.businesses[key]["image_url"]) { data.businesses[key]["image_url"] = '/public/beer.png'; }
        newHTML += templateHTML.replace(/{{imgurl}}/g, data.businesses[key]["image_url"])
                                .replace(/{{name}}/g, data.businesses[key]["name"])
                                .replace(/{{url}}/g, data.businesses[key]["url"])
                                .replace(/{{rating}}/g, data.businesses[key]["rating_img_url"])
                                .replace(/{{phone}}/g, data.businesses[key]["phone"])
                                .replace(/{{buttId}}/g, data.businesses[key]["id"]);
    }
    $('#result').html(newHTML);
    
    for(var key in data.attends) {
        var num = data.attends[key]["users"].length;
        $('#'+data.attends[key]["barId"]).html(num + ' Going') ;
    }
}