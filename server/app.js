var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    express = require('express'),
    request = require('request'),
    properties = require('properties'),
    dust = require('dustjs-linkedin'),
    handlebars = require('handlebars'),
    jsrender = require('node-jsrender'),
    client = require('node-rest-client');


/**
 * configuring dust
 */
dust.config.whitespace = true;
dust.config.cache = false;
dust.onLoad = function (tmpl, cb) {
    fs.readFile(path.join('./views', path.relative('/', path.resolve('/', tmpl + '.dust'))),
        {encoding: 'utf8'}, cb);
};


/**
 * setting up express
 */
var app = express();
app.use(express.static('public'));


/**
 * setting up urls
 */
app.get('/:section/article:id.html', function (req, res) {
    async.parallel([
            /*
             * Retrieving the model
             */
            function(callback) {
                new client.Client().get("http://rutl014d.nandomedia.com:9191/mobile-api/v1/articles/" + req.params.id,
                    function (data, response) {
                        var model =  JSON.parse(String.fromCharCode.apply(null, new Uint16Array(data)));
                        callback(false, model);
                    }
                )
            },
            /*
             * Retrieving the menu config
             */
            function(callback) {
                new client.Client().get("http://localhost:3000/mock-menu-config.json",
                    function (data, response) {
                        callback(false, data);
                    }
                )
            },
            /*
             * Retrieving the properties config
             */
            function(callback) {
                new client.Client().get("http://localhost:3000/mock-prop-config.properties",
                    function (data, response) {
                        var props = properties.parse(String.fromCharCode.apply(null, new Uint16Array(data)));
                        callback(false, props);
                    }
                )
            }
        ],
        /*
         * Aggregating the config and model
         */
        function(err, results) {
            dust.stream("index", {
                "model": results[0],
                "menu": results[1],
                "prop": results[2]
            }).pipe(res);
        }
    );
});


/**
 * initializing the express server
 */
app.listen(3000, function () {
    console.log('http://localhost:3000 is now up and running');
});
