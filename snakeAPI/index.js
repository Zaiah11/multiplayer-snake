const io = require('socket.io')()

const PLAYERS = {}
let BOARD = boardBase()

io.on('connection', socket => { 
  const { id } = socket
  PLAYERS[id] = true

})

io.listen(3000)