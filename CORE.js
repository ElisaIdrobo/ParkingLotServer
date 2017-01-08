"use-strict";

//Setup Webserver
var server = require('express')();
server.set('view engine', 'ejs');
server.set('views', __dirname+'/html');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

server.post('/car',jsonParser, function(req,res){
    var id = req.body.id;
    var data = req.body.data;
    var timestamp = req.body.timestamp;
    console.log(req.body);
    console.log(id + ", "+ data + ", " + timestamp);
    return res.sendStatus(200);
});

//Opens an error page if no companion page is found (must be put near the last of all the code)
server.get('*', function(req, res) { res.render('error'); });

server.listen(process.env.PORT || 3000);
