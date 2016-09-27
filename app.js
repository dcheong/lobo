var express = require('express');
var app = express();
var Lob = require('lob')('test_409b8a53b0c8af0e49ca3d44bb31d99d990');

var repURL = 'https://www.googleapis.com/civicinfo/v2/representatives';

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/', function (req, res) {
    console.log(req);
    getReps(req.address);
    res.send('Got a POST request');
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

function getReps(address) {
    var options = {
        method: 'GET',
    };
    var query = {
        address: address
    }
    var params = Object.keys(query)
                        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
                        .join("&")
                        .replace(/%20/g,"+");
    fetch(repURL + '?' + params, options).then(function(res) {
        console.log(res);
      });
}