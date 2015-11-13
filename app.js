var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    request = require('request'),
    nunjucks = require('nunjucks'),
    dust = require('dustjs-linkedin'),
    jsrender = require('node-jsrender'),
    handlebars = require('express-handlebars');

var Client = require('node-rest-client').Client;
client = new Client();


/**
 * what templating engine do you want to use
 * 1) dust
 * 2) nunjucks
 * 3) jsrender
 * 4) handlebars
 */
//var engine = "";
var engine = "dust";
//var engine = "nunjucks";
//var engine = "jsrender";
//var engine = "handlebars";


/**
 * setting up the express app engine
 */
var app = express();
app.use(express.static('public'));
app.listen(3000, function () {
    console.log('http://localhost:3000 is now up and running');
});
app.get('/:section/article:id.html', function (req, res) {
    client.get("http://rutl014d.nandomedia.com:9191/mobile-api/v1/articles/" + req.params.id,
        function (data, response) {
            var model = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(data)));
            if (engine == "dust") {
                dust.stream("index", {"model": model}).pipe(res);
            } else if (engine == "nunjucks") {
                res.render('index.html', {model: model});
            } else if (engine == "jsrender") {
                res.render('jsrender/index.html', {model: model});
            } else if (engine == "handlebars") {
                res.render('handlebars/index', {model: model});
            } else {
                throw err;
            }
        }
    );
});


/**
 * setting up handlebars
 */
if (engine == "handlebars") {
    app.engine('handlebars', handlebars());
    app.set('view engine', 'handlebars');
}


/**
 * setting up nunjucks
 */
if (engine == "nunjucks") {
    nunjucks.configure('views/nunjucks', {
        autoescape: true,
        express: app
    });
}


/**
 * setting up jsrender
 */
if (engine == "jsrender") {
    jsrender.express('html', app);
    app.set('view engine', 'html');
}


/**
 * setting up dust
 */
if (engine == "dust") {
    dust.config.whitespace = true;
    dust.config.cache = false;
    dust.helper = require('dustjs-helpers');
    dust.onLoad = function (tmpl, cb) {
        fs.readFile(path.join('./views/dust', path.relative('/', path.resolve('/', tmpl + '.dust'))),
            {encoding: 'utf8'}, cb);
    };
}


