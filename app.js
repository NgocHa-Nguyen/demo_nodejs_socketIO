var mysql      = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!!!")
});

var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'public')));

//Tạo router
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/views/chat.html'));
});

app.get("/getHistoryMsg", function (req, res) {
	var sql = "SELECT * FROM messages";
	con.query(sql, function(err, results) {
	    if (err) throw err;
    	res.json(results);
  	});
});

//Tạo socket 
io.on('connection', function (socket) {
    console.log('Welcome to server chat');

    socket.on('send', function (data) {
    	var sql = "INSERT messages(username, message, time) VALUE ('" 
    	+ data.username + "', ' " + data.message + "', '" + data.time + "')";
	  	con.query(sql, function(err, results) {
		    if (err) throw err;
	  	});

	  	io.sockets.emit('send', data);
    });

    socket.on('online', function (data) {
    	var sql = "UPDATE users SET status = 'on' WHERE username = '" + data.username + "'";
	  	con.query(sql, function(err, results) {
		    if (err) throw err;
	  	});

	  	var sql = "SELECT * FROM users WHERE status = 'on'";
	  	con.query(sql, function(err, results) {
		    if (err) throw err;
		    var res = {
		    	username : data.username,
		    	users : results
		    }
		    io.sockets.emit('online', res);
	  	});
        
    });

    socket.on('logout', function (data) {
        var sql = "UPDATE users SET status = 'off' WHERE username = '" + data.username + "'";
	  	con.query(sql, function(err, results) {
		    if (err) throw err;
	  	});

	  	var sql = "SELECT * FROM users WHERE status = 'on'";
	  	con.query(sql, function(err, results) {
		    if (err) throw err;
		    var res = {
		    	username : data.username,
		    	users : results
		    }
		    io.sockets.emit('online', res);
	  	});
    });
});

//Khởi tạo 1 server listen tại 1 port
server.listen(3000);