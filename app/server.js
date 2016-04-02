var express     	= require('express'),
    app         	= express(),
    bodyParser  	= require('body-parser'),
    mongo       	= require('./mongo.js'),
    mongoPeople 	= mongo('pantherpark', 'users'),
    mongoLots		= mongo('pantherpark', 'lots'),
    mongoBuildings	= mongo('pantherpark', 'buildings'),
    port        	= process.env.PORT || 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/users/:id', function(req, res){
	res.set('Content-Type', 'application/json');
    mongoPeople.get(req.params.id, function(err, code, document){
        res.status(code).send(JSON.stringify(err ? err : document[0]));
    });
});

app.get('/buildings', function(req, res){
	res.set('Content-Type', 'application/json');
    mongoBuildings.get(null, function(err, code, documents){
        res.status(code).send(JSON.stringify(err ? err : documents));
    });
});

app.get('/lots', function(req, res){
	res.set('Content-Type', 'application/json');
    mongoLots.get(null, function(err, code, documents){
        res.status(code).send(JSON.stringify(err ? err : documents));
    });
});

app.listen(port, function(){
	console.log('LISTENING ON PORT: ' + port);
});