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
      it('should create new food', () => {
        const game = new Game()
        const oldLength = Object.keys(game.idxMap.empty[0]).length
        game.generateFood()
        const { idxMap, snakes } = game
        const { empty, food } = idxMap
        expect(food.length).to.not.equal(0)
        expect(food).to.be.an('object')
        expect(Object.keys(empty[food.x]).length).to.equal(oldLength - 1)
      })
      it('should update board', () => {
        const game = new Game()
        const oldBoard = game.board
        game.generateFood()
        expect(game.board).to.not.deep.equal(oldBoard)
      })
      it('should update player movement', () => {
        const game = new Game()
        const oldBoard = game.board
        game.playerMove([
          { player: 'player1', direction: 'UP' },
          { player: 'player2', direction: 'DOWN'}
        ])
        expect(game.board).to.not.deep.equal(oldBoard)
        expect(game.snakes.player1.pop()).to.deep.equal({ x: 2, y: 3 })
      })
      it('should handle player eating', () => {
        const game = new Game()
        const { board, snakes } = game
        snakes.player1 = [{ x: 8, y: 7 }]
        game.playerMove([{ player: 'player1', direction: 'UP' }])
        expect(game.snakes.player1.length).to.equal(2)
        expect(game.board).to.not.deep.equal(board)
      })
      it('should handle collisions with self', () => {
        const game = new Game()
        const { snakes } = game
        snakes.player1 = [
          { x: 3, y: 0 },
          { x: 3, y: 1 },
          { x: 3, y: 2 },
          { x: 3, y: 3 }, 
          { x: 4, y: 3 },
          { x: 4, y: 2 }
        ]
        game.updateBoard()
        game.playerMove([{ player: 'player1', direction: 'UP' }])
        expect(game.snakes.player1.length).to.equal(0)
      })
      it('should keep track of all players', () => {
        const game = new Game()
        expect(game.idxMap.players[3][3]).to.equal(2)
        game.playerMove([
          { player: 'player1', direction: 'UP' },
          { player: 'player2', direction: 'DOWN' }
        ])
        expect(game.idxMap.players[2][3]).to.equal(2)
      })
      // it('should handle collisions with players', () => {
      //   const game = new Game()
      //   const { idxMap, snakes } = game
      //   snakes.player1 = [
      //     { x: 3, y: 0 },
      //     { x: 3, y: 1 },
      //     { x: 3, y: 2 },
      //     { x: 3, y: 3 }
      //   ]
      //   snakes.player2 = [
      //     { x: 4, y: 3 },
      //     { x: 4, y: 2 },
      //     { x: 4, y: 1 }
      //   ]
      //   game.updateBoard()
      //   game.playerMove([{ player: 'player2', direction: 'UP' }])
      //   expect(game.idxMap.snakes.player2.length).to.equal(0)
      // })
    })
  })
})