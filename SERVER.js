var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var listUser=[];
var listMessage=[];
var listID = [];
io.on("connection", function(socket) {
  console.log("Someone just connected" + socket.id);
  listID.push(socket.id);

  socket.on("client-send-Username", function(data) {
    console.log(data);
    if(listUser.indexOf(data)>=0) {
        socket.emit("server-send-false");
    }else{
        listUser.push(data);
        socket.Username = data;
        socket.emit("server-send-success", data);
        io.sockets.emit("server-send-listUser", listUser);
    }
  });

  socket.on("logOut", function() {
    console.log("someonelogout");
    listUser.splice(
        listUser.indexOf(socket.Username), 1
    );
    socket.broadcast.emit("server-send-listUser", listUser);
  });

  socket.on("disconnect", function() {
    console.log("someonelogout");
    listUser.splice(
        listUser.indexOf(socket.Username), 1
    );
    socket.broadcast.emit("server-send-listUser", listUser);
  });

  socket.on("client-send-message", function(data) {
      listMessage.push({user: socket.Username, message:data});
      io.sockets.emit("server-send-listMessage", listMessage);
  });

  socket.on("someone-is-texting", function() {
      //console.log(socket.Username + " .... ");
      var s = socket.Username + "......"
      socket.broadcast.emit("server-someoneTexting", s);

  });

  socket.on("someone-stop-texting", function() {
      console.log(socket.Username + " stop ");
      io.sockets.emit("server-someoneStopTexting");
  });

});

app.get("/", function(req, res) {
  res.render("index");
});
