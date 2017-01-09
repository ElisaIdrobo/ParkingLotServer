"use-strict";

//Setup Webserver
var server = require('express')();
server.set('view engine', 'ejs');
server.set('views', __dirname+'/html');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//setup connection to database
var pg = require('pg');
pg.defaults.ssl = true; //required by heroku postgres
var connectionString = process.env.DATABASE_URL ||'postgres://localhost:5432/localdb';
var client = new pg.Client(connectionString);
client.connect();

//Post request for sensor's message- data: 1-car entered, 0-car exited
server.post('/car',jsonParser, function(req,res){
    //json request fields
    var deviceId = req.body.id;
    var data = req.body.data;
    var timestamp = req.body.timeStamp;
    console.log(req.body);

    //update database as needed
    var parkingLotQuery = client.query('SELECT parking_lot_id FROM Sensor WHERE device_id = $1', [deviceId]);
    parkingLotQuery.on('error', function(err) {
        client.end();
        console.log(err);
    });
    parkingLotQuery.on('row', function(result){
        console.log(result)
        if(!result){
            console.log('no result returned for parkingLotQuery');
        }else if(data == 0){//car exiting
            client.query("UPDATE Parking_Lot SET available_spaces = available_spaces+1 WHERE id = $1", [result.parking_lot_id]);
        }else if(data == 1){//car entering
            client.query("UPDATE Parking_Lot SET available_spaces = available_spaces-1 WHERE id = $1", [result.parking_lot_id]);
        }
    });
    return res.sendStatus(200)
});

//Opens an error page if no companion page is found (must be put near the last of all the code)
server.get('*', function(req, res) { res.render('error'); });

server.listen(process.env.PORT || 3000);
