const { expect } = require('chai')
const { Board } = require('./game')

describe('snake', () => {
  describe('board', () => {
    describe('properties', () => {
      it('should have property board', () => {
        const { board } = new Board()
        expect(board).to.be.an('array')
      })
      it('should have property idxMap', () => {
        const { idxMap } = new Board()
        expect(idxMap).to.be.an('object')
      })
    })
    describe('methods', () => {
      it('should be able to create new food', () => {
        const board = new Board()
        const oldLength = board.idxMap.empty.length
        board.generateFood()
        expect(board.idxMap.active.food.length).to.not.equal(0)
        expect(board.idxMap.empty.length).to.equal(oldLength - 1)
      })
      it('should be able to update board', () => {
        const board = new Board()
        const oldBoard = board.board
        board.generateFood()
        expect(board.board).to.not.deep.equal(oldBoard)
      })
    })
  })
})