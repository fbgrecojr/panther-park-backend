/**
 * Creates an instance of a Mongo Object. This instance will
 * be used to interact with mongodb
 * @param {[type]} db         [the name of the database]
 * @param {[type]} collection [the name of the collection]
 */
function Mongo(db, collection) {
	this.Mongo			= require('mongodb');
	this.MongoClient 	= this.Mongo.MongoClient;
	this.ObjectID 		= this.Mongo.ObjectID;
	this.database		= db;
    this.collection  	= collection;
    this.url         	= 'mongodb://localhost:27017/' + this.database;
}

/**
 * Insert one item into the database
 * @param  {Object}   document [represents a mongodb document]
 * @param  {Function} callback [represents the functionality to perform after an insertion attempt]
 * @return {Function}          [return/envoke the callback parameter]
 */
Mongo.prototype.insertOne = function(document, callback) {
	//assign current scope to a variable
	var self = this;
	//create an id that mongo can read from the id provided
	response._id = new self.ObjectID(pad(response._id));

	self.MongoClient.connect(self.url, function(err, db){
		if(err){
			return callback(err, 500);
		}
		db.collection(self.collection).insertOne(response, function(err, result){
			db.close();
			return err ? callback(err, 400, null) : callback(null, 201, result.ops[0]);
	    });
	});	
};

/**
 * Delete one item from the database
 * @param  {String}   id 		[the id of the document to be deleted]
 * @param  {Function} callback 	[represents the functionality to perform after a deletion attempt]
 * @return {Function}          	[return/envoke the callback parameter]
 */
Mongo.prototype.delete = function(id, callback) {
	var self = this;
	self.MongoClient.connect(self.url, function(err, db) {
	    if(err) {
			return callback(err, 500);
		}
		db.collection(self.collection).deleteOne({_id: new self.ObjectID(pad(id))}, function(err, result) {
			if(err) {
				return callback(err, 400);
			}
			db.close();
			return callback(null, result.result.n === 1 ? 204 : 400);
	  	});
	});
};

/**
 * Update one item in the database
 * @param  {String}   id 		[the id of the document to be updated]
 * @param  {Object}   data 		[represents a mongodb document]
 * @param  {Function} callback 	[represents the functionality to perform after an update attempt]
 * @return {Function}          	[return/envoke the callback parameter]
 */
Mongo.prototype.updateOne = function(id, data, callback) {
	var self = this;
	self.validate(data, true, function(err, response){
		if(err) {
			return callback(err);
		}
		self.MongoClient.connect(self.url, function(err, db){
			if(err) {
				return callback(err);
			}
			db.collection(self.collection).updateOne({
				"_id": new self.ObjectID(pad(id))
			}, {
				//things to update
				$set: response
			}, function(err, result) {
				db.close();
				if(err) {
					return callback(err, null);
				}
				return callback(null, result.result.n === 1 ? 'true' : 'false');
		  	});
		});
	});
};

/**
 * Retrieve one or more items from the database
 * @param  {Object}   data 		[contains the criteria for the query]
 * @param  {Function} callback 	[represents the functionality to perform for each item matching the criteria]
 * @return {Function}          	[return/envoke the callback parameter]
 */
Mongo.prototype.get = function(data, callback) {
	var self = this;
	self.MongoClient.connect(self.url, function(err, db) {
	    if(err) {
			return callback(err, 500);
		}
		data = (data === null) ? {} : {_id: data};
		db.collection(self.collection).find(data).toArray(function(err, docs){
			console.log(docs);
			db.close();
			if(err) {
				return callback(err, 500);
			} else if(self.collection === 'lots') {
				var lots = docs;
				lots.forEach(function(lot){
					var spaces = lot.spaces;
					spaces.map(function(space){
						space.available = Math.random() <= 0.7 ? space.available : space.available === 1 ? 0 : 1;
					});
				});
			}
			return callback(null, docs.length === 0 ? 404 : 200, docs);
		});
	});
};

/**
 * Exposed function. Serves as the entry point into this module
 * @param 	{String} db         [the name of the database]
 * @param 	{String} collection [the name of the collection]
 * @return 	{Object}            [returns an instance of a Monog object]
 */
module.exports = function(db, collection) {
	if (collection === undefined) {
		return new Mongo( (db === undefined ? 'test' : db) , 'test');
	} else {
		return new Mongo(db, collection);
	}
};

/**
 * We are overriding the mongodb _id field. Hence, we must ensure that our 
 * provided id complies with the mongodb enforced requirement of a string of length 12.
 * @param  {String} string [the string to be converted into an acceptable mongodb objectid format]
 * @return {String}        [the converted string]
 */
var pad = function (string) {
	var pad = "000000000000";
	return pad.substring(0, pad.length - string.length) + string;
};