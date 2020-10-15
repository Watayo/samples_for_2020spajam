// make midleware
const express = require('express');
const app = express();

app.use(express.static('public'));

// localhost:3000
const server = app.listen(8080, function () {
  console.log('connect!');
});


// socket
const socket = require('socket.io');
const io = socket(server);

// connection event
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('sucess connect!' + socket.id);
  /*　jsからモーションデータもってくるやつー
  socket.on('motion', motionMsg);
  function motionMsg(data) {
    // 送信元以外の全てのクライアントに送信
    // socket.broadcast.emit('motion', data);
    // 全部に送信
    // io.sockets.emit('mouse', data);
    console.log(data);
  }
  */

  socket.on('cheering', cheeringMsg);
  function cheeringMsg(cheering) {
    // 送信元以外の全てのクライアントに送信
    // socket.broadcast.emit('motion', data);
    // 全部に送信
    // io.sockets.emit('mouse', data);
    console.log(cheering);
  }
}