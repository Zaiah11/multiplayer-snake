const { expect } = require('chai')
const openSocket = require('socket.io-client')
const socket = openSocket('http://localhost:3000')

describe('snake API', () => {
  it('should respond to a new connection with a board', (done) => {
    socket.emit('new player')
    socket.on('game updated', ({ board }) => {
      expect(board).to.be.an('array')
      done()
    })
  })
})