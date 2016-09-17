var auth = { 
    consumerKey: "mY7J5hvTUPX7NTLRAZ7TVg", 
    consumerSecret: "JkqVm7VWhUejIIVDLjHBQI2Pa_k",
    accessToken: "7sbA81Z0sHv7VCacqNQQI2sZGetyxVja",
    accessTokenSecret: "xW6Xj9-PVHyfqxJoHAGLajtkqjI",
};
var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
};


var offset = 0;

function foodfinder(){

    if(offset===0)
        $('#displaylist').empty();

    var terms = document.getElementById('type').value;
    var near = "champaign";
    var radius = $( "#distance" ).slider( "value" )*1600;
    

    parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    if(loc){
        var cll=lat+","+lon;
        parameters.push(['cll', cll]);
    }
    parameters.push(['offset', offset]);
    parameters.push(['sort', 2]);
    parameters.push(['category_filter', 'restaurants']);
    parameters.push(['radius_filter', radius]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = { 
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters 
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'cache': true,
        'dataType' : 'jsonp',
        'callback': 'cb',
        'success' : function(data, textStats, XMLHttpRequest){
            console.log(data);
            for(var i=0; i<data.businesses.length; i++){
                createpost(data.businesses[i]);
            }
        }
    });
}

function createpost(data){
    var div = $('<div class="item"></div>');
    $('<a/>').text(data.name).attr("href", data.url).appendTo($(div));
    $('<img/>').attr("src", data.rating_img_url).appendTo($(div));
    $('<p/>').text('Phone: '+data.display_phone).appendTo($(div));
    $('<p/>').text('Location: '+data.location.address[0]+" "+data.location.city + ", "+data.location.state_code +" "+data.location.postal_code).appendTo($(div));
    $('<p/>').text('Review: '+data.snippet_text).appendTo($(div));
    $("#displaylist").append(div);
}
var loc=false;
function geolocate(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(data){
            lat=data.coords.latitude;
            lon=data.coords.longitude;
            console.log(data.coords.latitude);
            console.log(data.coords.longitude);
            loc=true;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}