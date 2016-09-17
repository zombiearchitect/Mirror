var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'jiYEPOVIZ9QR_h9pPaxVGw',
  consumer_secret: 'q4ND8zLkRGxf6Qv15izsIMrOTGU',
  token: 'Sw2smzf7n-KAUHlXKmfR3SvCR7gpQzxB',
  token_secret: 'MThXzPvYrSfv1Gp3BC-svdVzxlk',
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.get("/food", function(req, res) {
  yelp.search({ term: 'food', location: 'Waterloo University' })
  .then(function (data) {
    res.jsonp(req.query.callback + '('+ JSON.stringify(data) + ');');
  })
  .catch(function (err) {
    res.send(err);
  });

});
