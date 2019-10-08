var express = require('express');

const app = express()
var http = require('http').createServer(app);

var io = require('socket.io')(http);

const bodyparser = require("body-parser")

const path = require('path');

const expressLayouts = require('express-ejs-layouts')


app.use(bodyparser())

app.set('view engine', 'ejs')
app.use(express.static(__dirname + 'views'))
app.set('views', path.join(__dirname, 'views'));

// Setamos que nossa engine será o ejs
app.use(expressLayouts)

app.get('/', function (req, res) {
  res.render('a');
});

const messages = []


io.on('connection', function (socket) {
  socket.on("entrar", (nome) => {
    if (nome) {
      socket.emit("init_load", messages)
      socket.broadcast.emit("new_user", nome)
      socket.on("digitando", () => {
        socket.broadcast.emit("digitando", nome)
      })
      socket.on("new_message", (message) => {
        message = {
          usuario: nome,
          body: message
        }
        messages.push(message)
        io.emit("new_message", message)
      })
    }
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
