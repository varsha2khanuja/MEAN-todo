var express = require('express');
var router = express.Router();
const JSONStream = require('JSONStream');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://varsha:vk130897@cluster0-shard-00-00-2wafl.mongodb.net:27017,cluster0-shard-00-01-2wafl.mongodb.net:27017,cluster0-shard-00-02-2wafl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
const client = new MongoClient(uri,  {useNewUrlParser: true });

var collection;
var db;

MongoClient.connect(uri, function(err, client) {
	if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.info("connection established");
   collection = client.db("meantodos").collection("todos");
   // perform actions on the collection object
   console.log("connected");
});

router.get('/', function(req, res, next) {
    if(!collection){
        res.send("Connection not established");
        return ;
    }
       // perform actions on the collection object
       var cursor = collection.find();
       cursor.pipe(JSONStream.stringify()).pipe(res.type('json'));
});

router.post('/', function(req, res, next) {
    if(!collection){
        res.json({error: "Connection not established"});
        return ;
    }
    if(req.body && req.body.text){
           // perform actions on the collection object
           collection.insertOne({text: req.body.text}, (error, result) => {
            if(error) {
                console.info(error);
                return res.status(500).send(error);
            }
            res.send(result.result);
            });

    }
});
module.exports = router;