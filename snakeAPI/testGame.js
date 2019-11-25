const { expect } = require('chai')
const { Game } = require('./game')

describe('snake', () => {
  describe('board', () => {
    describe('properties', () => {
      it('should have property board', () => {
        const { board } = new Game()
        expect(board).to.be.an('array')
      })
      it('should have property idxMap', () => {
        const { idxMap, board } = new Game()
        expect(idxMap).to.be.an('object')
        expect(board.length).to.equal(Object.keys(idxMap.empty[0]).length)
      })
      it('should have property gameOver', () => {
        const { gameOver } = new Game()
        expect(gameOver).to.equal(false)
      })
    })
    describe('methods', () => {
      it('should be able to create new food', () => {
        const game = new Game()
        const oldLength = Object.keys(game.idxMap.empty[0]).length
        game.generateFood()
        const { empty, active } = game.idxMap
        const { food } = active
        expect(food.length).to.not.equal(0)
        expect(food).to.be.an('object')
        expect(Object.keys(empty[food.x]).length).to.equal(oldLength - 1)
      })
      it('should be able to update board', () => {
        const game = new Game()
        const oldBoard = game.board
        game.generateFood()
        expect(game.board).to.not.deep.equal(oldBoard)
      })
      it('should be able to update player movement', () => {
        const game = new Game()
        const oldBoard = game.board
        game.playerMove([
          { player: 'player1', direction: 'UP' },
          { player: 'player2', direction: 'DOWN'}
        ])
        expect(game.board).to.not.deep.equal(oldBoard)
        expect(game.idxMap.active.player1.pop()).to.deep.equal({ x: 2, y: 3 })
      })
      it('should be able to handle player eating', () => {
        const game = new Game()
        const { idxMap, board } = game
        const { active } = idxMap
        active.player1 = [{ x: 8, y: 7 }]
        game.playerMove([{ player: 'player1', direction: 'UP' }])
        expect(game.idxMap.active.player1.length).to.equal(2)
        expect(game.board).to.not.deep.equal(board)
      })
    })
  })
})