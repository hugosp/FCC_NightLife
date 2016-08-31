$(document).ready(function(){
    $('#search').click(function(){

        $(".result").html('');
        $.get( "/api/"+$('#location').val(), function( data ) {

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
            console.log(newHTML);
            $('#result').html(newHTML);
        });
    });
});