var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    request = require('request'),
    nunjucks = require('nunjucks'),
    dust = require('dustjs-linkedin');

var Client = require('node-rest-client').Client;
client = new Client();


/**
 * setting up dust
 */
var useDust = false;
dust.config.whitespace = true;
dust.config.cache = false;
dust.helper = require('dustjs-helpers');
dust.onLoad = function (tmpl, cb) {
    fs.readFile(path.join('./views', path.relative('/', path.resolve('/', tmpl + '.dust'))),
        {encoding: 'utf8'}, cb);
};


var app = express();
app.get('/', function (req, res) {
    client.get("http://localhost:3000/mock-server-response.json", function (data, response) {
        if (useDust == true) {
            dust.stream("index", {
                "model": data
            }).pipe(res);
        } else {
            res.render('index.html', {model: data});
        }
    });
});


/**
 * setting up nunjucks
 */
nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.use(express.static('public'));

app.listen(3000, function () {
    console.log('http://localhost:3000 is now up and running');
});
