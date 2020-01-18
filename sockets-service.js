let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);
let Food = require("./server-food.js");

let food = new Food({ x: 800, y: 600 }, 10);

food.generate(200);

io.on("connection", function(socket) {
  socket.on("connect", function() {
    socket.broadcast.emit("broadcast", data);
  });

  socket.on("request-food", function() {
    socket.emit("send-food", food);
  });

  socket.on("request-players", function() {
    // socket.emit("send-food", food);
    console.log("players requested!");
    socket.broadcast.emit("request-players");
  });

  socket.on("socketID", function(data) {
    socket.broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", function() {
    socket.broadcast.emit("user-disconnected", socket.id);
    // console.log("user disconnected", socket);
  });

  socket.on("piece-eaten", function(id) {
    console.log("piece of food eaten: ", id);
    food.deletePiece(id);
    socket.broadcast.emit("piece-eaten", id);
  });
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/client.js", function(req, res) {
  res.sendFile(__dirname + "/client.js");
});
app.get("/player.js", function(req, res) {
  res.sendFile(__dirname + "/player.js");
});
app.get("/players.js", function(req, res) {
  res.sendFile(__dirname + "/players.js");
});
app.get("/client-food.js", function(req, res) {
  res.sendFile(__dirname + "/client-food.js");
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
