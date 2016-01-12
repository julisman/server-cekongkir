// server.js a tes revert

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var http       = require("http");
var qs         = require("querystring");
// set your key rajaongkir.com
var key        = 'YOUR-KEY';
// setting option for call rajaongkir.com
var options = {
    "method": "GET",
    "hostname": "rajaongkir.com",
    "port": null,
    "path": "",
    "headers": {
        "key": key,
        "Content-Type" : 'application/x-www-form-urlencoded'
    }
};
//set cross domain
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set our port
var port = process.env.PORT || 8000;

// ROUTES FOR OUR API
var router = express.Router();

// get data city
router.get('/city', function(req, response) {

    options.method = 'GET';
    options.path   = '/api/starter/city';

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            response.json(JSON.parse(body.toString()))
        });
    });

    req.end();
});

// get data cost
router.get('/cost/:origin/:destination/:weight', function(req, response) {

    options.method = 'POST';
    options.path   = '/api/starter/cost';

    var self = this;
    self.origin      = req.params.origin;
    self.destination = req.params.destination;
    self.weight      = req.params.weight;

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            response.json(JSON.parse(body.toString()))
        });
    });

    req.write(qs.stringify({ origin: self.origin,
        destination: self.destination,
        weight: self.weight
        }));
    req.end();
});

// all of our routes will be prefixed with /api/v1
var version = 'v1';

app.use('/api/'+version+'/', router);

//start the server
app.listen(port);
console.log('Server running on port ' + port);