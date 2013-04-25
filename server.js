var express = require('express');
var app = express();

app.use("/", express.static(__dirname + '/app'));

app.get('/', function(req, res){
	res.status(200).sendfile('./app/index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});