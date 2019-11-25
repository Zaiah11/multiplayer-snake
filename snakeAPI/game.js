exports.Game = class Game {
  constructor() {
    this.board = this.base()
    this.idxMap = this.initMap()
    this.gameOver = false
    this.tileTypes = {
      empty: 0,
      food: 1,
      player1: 2,
      player2: 3,
      player3: 4,
      player4: 5
    }
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
      active: {
        food: { x: 7, y: 7},
        player1: [{ x: 3, y: 3 }],
        player2: [{ x: 11, y: 3 }],
        player3: [{ x: 3, y: 11 }],
        player4: [{ x: 11, y: 11 }]
      }
    }
    const { board } = this
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        idxMap.empty[x][y] = true
      }
    }
    return idxMap
  }

  generateFood() {
    const { idxMap } = this
    const { empty, active } = idxMap
    const { x, y } = this.findEmptyTile()
    delete empty[x][y]
    active.food = { x, y }
    this.updateBoard()
  }

  findEmptyTile() {
    const { idxMap } = this
    const { empty } = idxMap
    const x = Math.floor(Math.random() * Object.keys(empty).length)
    const y = Math.floor(Math.random() * Object.keys(empty[x]).length)
    if (!empty[x][y]) return findEmptyTile()
    return { x, y }
  }

  updateBoard() {
    const board = this.base()
    const { idxMap, tileTypes } = this
    const { active } = idxMap
    const { food } = active
    board[food.x][food.y] = 1
    Object.keys(active).forEach(player => {
      if (player !== 'food') {
        active[player].forEach(({ x, y }) => {
          board[x][y] = tileTypes[player]
        })
      }
    })
    this.board = board
  }

  playerMove(moves) {
    moves.forEach(({ player, direction }) => {
      const { idxMap } = this
      const { active, empty } = idxMap
      const snake = active[player]
      active[player] = snake.map(({ x, y }, i) => {
        if (i === 0) empty[x][y] = true
        if (i === snake.length - 1) {
          delete empty[x][y]
          if (direction === 'LEFT') y = y - 1
          if (direction === 'RIGHT') y = y + 1
          if (direction === 'UP') x = x - 1
          if (direction === 'DOWN') x = x + 1
          return { x, y }
        }
        const next = previousLoc[i + 1]
        if (next.isNew) delete next.isNew
        return next
      })
      this.didPlayerEat()
    })
  }

  didPlayerEat() {
    const { idxMap } = this
    const { active } = idxMap
    const { food } = active
    Object.keys(active).forEach(player => {
      if (player !== 'food') {
        active[player].forEach(({ x, y }) => {
          if (x === food.x && y === food.y) {
            this.playerGrow(player)
          }
        })
      }
    })
    this.updateBoard()
  }

  playerGrow(player) {
    const { idxMap } = this
    const { active } = idxMap
    const { food } = active
    const { x, y } = food
    active[player].push({ x, y, isNew: true})
    this.generateFood()
  }
}
