var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    request = require('request'),
    dust = require('dustjs-linkedin');

var Client = require('node-rest-client').Client;
client = new Client();

dust.config.whitespace = true;
dust.config.cache = false;

// Define a custom `onLoad` function to tell Dust how to load templates
dust.onLoad = function (tmpl, cb) {
    fs.readFile(path.join('./views', path.relative('/', path.resolve('/', tmpl + '.dust'))),
        {encoding: 'utf8'}, cb);
};

var app = express();
app.get('/*/article:id.html', function (req, res) {
    client.get("http://rutl014d.nandomedia.com:9191/mobile-api/v1/articles/" + req.params.id,
        {headers:{"Content-Type": "application/json"}},
        function (data, response) {
            dust.stream("index", {
                "model": data
            }).pipe(res);
        });
});

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('http://localhost:3000 is now up and running');
});
