"use strict";

//Setup the Webserver Component
var server = require('express')();
server.set('view engine', 'ejs');
server.set('views', __dirname + '/html');

//Setup the Body Parser Component
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Setup the Youtube Component
var ytdl = require('ytdl-core');

//-------------------------------------------------------------------------------------------------------

server.get('/fakegoogle', function(req, res) { res.render('fakegoogle'); }); //Opens A Fake Version of Google

server.get('/pokemon', function(req, res) { res.render('pokemon'); }); //Opens a 3D Rendering of a Pokemon Map

server.get('/weather', function(req, res) { res.render('weather'); }); //Opens up A Weather Board

server.get('/dashboard', function(req, res) { res.render('dashboard'); }); //Opens up A Weather Board

//-------------------------------------------------------------------------------------------------------

server.post('/echo', urlencodedParser, function(req, res) 
{
    res.setHeader('Content-Type', 'application/json');
    
    if (req.body.text == undefined)
    {
        return res.send("No response formed." + "\n" + "Remember that the key is called text!");
    }
        return res.send("Response > " + req.body.text);
});

var ticketNumber = 0;

server.post('/ticketNumber', urlencodedParser, function(req, res) 
{ 
    res.setHeader('Content-Type', 'application/json');

    ticketNumber++;
    
    return res.send("You are the " + ticketNumber + " in Line!");
}); 

server.post('/isEven', urlencodedParser, function (req, res) 
{ 
    res.setHeader('Content-Type', 'application/json');
    
    if (req.body.number == undefined) 
    { 
        return res.send("What Number?"); 
    }
    
    else
    {
        if (Number(req.body.number) % 2 == 0)
        {
            return res.send(req.body.number + " is Even"); 
        }
        
        else
        {
            return res.send(req.body.number + " is Odd");
        }
    }
        return res.send("???");
});

//-------------------------------------------------------------------------------------------------------

var text = "Untitled";

server.get('/heyMa', function(req, res) 
{ 
    res.render('heyMa',
    {
        heading: text
    });
});

server.post('/heyMa', urlencodedParser, function (req, res)
{ 
    res.setHeader('Content-Type', 'application/json');
    
    if (req.body.newText == undefined) 
    { 
        return res.send("Website Text Not Changed."); 
    }
    
    else
    {
        text = req.body.newText;
        
        return res.send("Website Text Changed!"); 
    }
});

//-------------------------------------------------------------------------------------------------------

var subs = 12698, visitors = 87359, comments = 6302, posts = 268;
var subBase = 12000, visitBase = 90000, commentBase = 6000, postBase = 200;

server.get('/stats', function(req, res) 
{ 
    res.render('stats',
    {
        subSubscribers: subs, 
        subVisitors: visitors,
        subComments: comments,
        subPosts: posts,
        
        subPercent: Math.ceil(subs/subBase),
        visitorPercent: Math.ceil(visitors/visitBase),
        commentPercent: Math.ceil(comments/commentBase),
        postPercent: Math.ceil(posts/postBase)
    });
});

server.post('/stats', urlencodedParser, function (req, res)
{ 
    var fullResponse = "";
    
    res.setHeader('Content-Type', 'application/json');
    
    if (req.body.subs != undefined) 
    { 
        subs = Number(req.body.subs); 
        
        fullResponse += "Subscription Statistics Updated!" + "\n"; 
    }
    
    if (req.body.visitor != undefined) 
    { 
        visitors = Number(req.body.visitor); 
        
        fullResponse += "Visitor Statistics Updated!" + "\n"; 
    }
    
    if (req.body.comment != undefined) 
    { 
        comments = Number(req.body.comment); 
        
        fullResponse += "Comment Statistics Updated!" + "\n"; 
    }
    
    if (req.body.post != undefined) 
    { 
        posts = Number(req.body.post); 
        
        fullResponse += "Post Statistics Updated!" + "\n"; 
    }
    
    res.send(fullResponse); 
});

//-------------------------------------------------------------------------------------------------------

server.post('/youtubevideo', urlencodedParser, function (req, res)
{
    if (!req.body) { return res.sendStatus(400); }
    
    ytdl.getInfo(req.body.u, {downloadURL: true}, function(err, info) 
    {
       var QUAL = req.body.q;
        
	   var links = info.formats;
	   var size = links.length;
        
	   while (size--)
	   {
		  if (links[size].container == "mp4" && links[size].audioEncoding != null)
		  {
			 if (links[size].resolution == QUAL)
			 {
                 res.setHeader('Content-Type', 'application/json');
                 return res.send(links[size].url);
			 }
		  }
	   }
    });
});

//---------------------------------------------------------------------------------

server.get('*', function(req, res) { res.render('error'); }); //Opens an error page if no companion page is found (must be put near the last of all the code)

server.listen(process.env.PORT || 3000);
