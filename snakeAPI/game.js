exports.Board = class Board {
  constructor(width, height) {
    this.board = this.base()
    this.idxMap = this.initMap()
    this.tileTypes = {
      empty: 0,
      food: 1,
      player1: 2,
      player2: 3,
      player3: 4,
      player4: 5
    }
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
      empty: [],
      active: {
        food: [],
        player1: [{ x: 3, y: 3 }],
        player2: [{ x: 11, y: 3 }],
        player3: [{ x: 3, y: 11 }],
        player4: [{ x: 11, y: 11 }]
      }
    }
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        idxMap.empty.push({ x, y })
      }
    }
    return idxMap
  }
  generateFood() {
    const { idxMap } = this
    const { empty } = idxMap
    const idx = Math.floor(Math.random() * empty.length)
    const loc = empty[idx]
    this.idxMap.empty = [
      ...empty.slice(0, idx),
      ...empty.slice(idx + 1)
    ]
    this.idxMap.active.food = [loc]
    this.updateBoard()
  }
  updateBoard() {
    const board = this.base()
    const { idxMap, tileTypes } = this
    const { active } = idxMap
    Object.keys(active).forEach(type => {
      active[type].forEach(({ x, y }) => {
        board[x][y] = tileTypes[type]
      })
    })
    this.board = board
  }
}
