exports.Game = class Game {
  constructor() {
    this.tileTypes = {
      empty: 0,
      food: 1,
      player1: 2,
      player2: 3,
      player3: 4,
      player4: 5
    }
    this.snakes = {
      player1: [{ x: 3, y: 3 }],
      player2: [{ x: 11, y: 3 }],
      player3: [{ x: 3, y: 11 }],
      player4: [{ x: 11, y: 11 }]
    }
    this.board = this.base()
    this.idxMap = this.initMap()
    this.gameOver = false
    this.updateBoard()
  }
  base() {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }
  initMap() {
    const idxMap = {
      empty: {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
        11: {},
        12: {},
        13: {},
        14: {}
      },
      players: {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
        11: {},
        12: {},
        13: {},
        14: {}
      },
      food: { x: 7, y: 7 }
    }
    const { board, snakes } = this
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        idxMap.empty[x][y] = true
      }
    }
    Object.keys(snakes).forEach(type => {
      const tileType = this.tileTypes[type]
      snakes[type].forEach(({ x, y }) => {
        idxMap.players[x][y] = tileType
      })
    })
    return idxMap
  }

  generateFood() {
    const { idxMap } = this
    const { x, y } = this.findEmptyTile()
    delete idxMap.empty[x][y]
    idxMap.food = { x, y }
    this.updateBoard()
  }

  findEmptyTile() {
    const { idxMap } = this
    const { empty } = idxMap
    const x = Math.floor(Math.random() * Object.keys(empty).length)
    const y = Math.floor(Math.random() * Object.keys(empty[x]).length)
    if (!empty[x][y]) return this.findEmptyTile()
    return { x, y }
  }

  updateBoard() {
    const board = this.base()
    const { idxMap, tileTypes, snakes } = this
    const { food } = idxMap
    board[food.x][food.y] = 1
    Object.keys(snakes).forEach(player => {
    snakes[player].forEach(({ x, y }) => {
      board[x][y] = tileTypes[player]
    })
    })
    this.board = board
  }

  playerMove(moves) {
    moves.forEach(({ player, direction }) => {
      const { idxMap, snakes } = this
      const { empty } = idxMap
      const snake = snakes[player]
      snakes[player] = snake.map(({ x, y }, i) => {
        if (i === 0) empty[x][y] = true
        if (i === snake.length - 1) {
          delete empty[x][y]
          if (direction === 'LEFT') y = y - 1
          if (direction === 'RIGHT') y = y + 1
          if (direction === 'UP') x = x - 1
          if (direction === 'DOWN') x = x + 1
          return { x, y }
        }
        const next = snake[i + 1]
        if (next.isNew) delete next.isNew
        return next
      })
      this.didPlayersDie()
    })
  }

  didPlayersDie() {
    const { idxMap, snakes } = this
    Object.keys(snakes).forEach(player => {
      const snake = snakes[player]
      const head = snake[snake.length - 1]
      const tail = snake.slice(0, snake.length - 1)
      const { x, y, isNew } = head
      tail.forEach(loc => {
        if (x === loc.x && y === loc.y) {
          this.playerDied(player)
        }
      })
    })
    this.didPlayersEat()
  }

  playerDied(player) {
    const { idxMap, snakes } = this
    snakes[player] = []
  }

  didPlayersEat() {
    const { idxMap, snakes } = this
    const { food } = idxMap
    Object.keys(snakes).forEach(player => {
      snakes[player].forEach(({ x, y }) => {
        if (x === food.x && y === food.y) {
          this.playerGrow(player)
        }
      })
    })
    this.updateBoard()
  }

  playerGrow(player) {
    const { idxMap, snakes } = this
    const { food } = idxMap
    const { x, y } = food
    snakes[player].push({ x, y, isNew: true})
    this.generateFood()
  }
}
