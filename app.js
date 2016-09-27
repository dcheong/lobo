var express = require('express');
var app = express();
var Lob = require('lob')('test_409b8a53b0c8af0e49ca3d44bb31d99d990');
var bodyParser = require('body-parser');

var repURL = 'https://www.googleapis.com/civicinfo/v2/representatives';

var http = require('http');
var fetch = require('node-fetch');

var CIVIC_API = 'AIzaSyD_B-5PY4l3rc4WLK-d23zY8YmsHD3gVcA';

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('index.html');
});

app.post('/', function (req, res) {
    console.log('post received');
    var aString = req.body.address1 + ' ' + req.body.address2 + ' ' + req.body.city + ' ' + req.body.state;
    getReps(aString, res);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

function getReps(aString, res) {
    console.log(aString);
    var options = {
        method: 'GET'
    };
    var query = {
        key: CIVIC_API,
        address: aString,
        levels: 'administrativeArea1'
    }
    var params = Object.keys(query)
                        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
                        .join("&")
                        .replace(/%20/g,"+");
    var result;
    var fQuery = repURL + '?' + params;
    fetch(repURL + '?' + params, options).then(function(res) {
       return res.json();
      }).then(function(json) {
          console.log(json);
          res.send(json.officials[0]);
      });
}