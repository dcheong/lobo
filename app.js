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
    if (req.body.state.length != 2) {
        res.status(500).send({error: 'The length of STATE must be 2 (e.g. TX, CA)'});
    }
    if (req.body.address1.length == 0
        || req.body.name.length == 0
        || req.body.city.length == 0
        || req.body.state.length == 0
        || req.body.zip == 0
        || req.body.message == 0) {
            res.status(500).send({error: 'One of the required fields was empty.'});
        }
    getReps(req.body, res);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

function getReps(body, res) {
    var aString = body.address1 + ' ' + body.address2 + ' ' + body.city + ' ' + body.state;
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
          var official = json.officials[0];
          Lob.letters.create({
              description: 'Letter To My Representative',
              to: {
                  name: official.name,
                  address_line1: official.address[0].line1,
                  address_city: official.address[0].city,
                  address_state: official.address[0].state,
                  address_zip: official.address[0].zip,
              },
              from: {
                  name: body.name,
                  address_line1: body.address1,
                  address_line2: body.address2,
                  address_city: body.city,
                  address_state: body.state,
                  address_zip: body.zip,
              },
              file: '<html style="padding-top: 3in; margin: .5in;"><h1>Letter for {{name}}</h1><p>{{message}}</p></html>',
              data: {
                  name: official.name,
                  message: body.message
              },
              color: true
          }, function(error, response) {
              res.statusCode = 302;
              res.redirect(response.url);
          });

      });
}