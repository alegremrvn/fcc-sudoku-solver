// convert to zero based
let convertCoordinate = (coordinate) => {
  let result = []

  for (let i = 65; i < 65 + 9; i++) {
    if (coordinate[0] === String.fromCharCode(i)) {
      result.push(i - 65)
      break
    }
  }

  result.push(coordinate[1] - 1)

  return result.join('')
}

class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long'
    }

    if (/[^1-9\.]/.test(puzzleString)) {
      return 'Invalid characters in puzzle'
    }

    let rowValue = true
    for (let i = 0; i < 9; i++) {
      const array = []
      for (let j = 0; j < 9; j++) {
        if (array.includes(puzzleString[(i * 9) + j]) &&
          puzzleString[(i * 9) + j] !== '.') {
          rowValue = false
          break
        } else {
          array.push(puzzleString[(i * 9) + j])
        }
      }
    }

    let columnValue = true
    if (rowValue) {
      for (let i = 0; i < 9; i++) {
        const array = []
        for (let j = 0; j < 9; j++) {
          if (array.includes(puzzleString[i + (j * 9)]) &&
            puzzleString[i + (j * 9)] !== '.') {
            columnValue = false
            break
          } else {
            array.push(puzzleString[i + (j * 9)])
          }
        }
      }
    }

    let regionValue = true
    if (rowValue && columnValue) {
      loop1: for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
          const array = []
          for (let k = 0; k < 3; k++) {
            if (array.includes(puzzleString[(i * 9) + (j + k)]) &&
              puzzleString[(i * 9) + (j + k)] !== '.') {
              regionValue = false
              break loop1
            }
          }
        }
      }
    }

    if (rowValue && columnValue && regionValue) {
      return 'Valid'
    } else {
      return 'Invalid'
    }
  }

  checkRowPlacement(puzzleString, coordinate, value) {
    let convertedCoordinate
    if (/[A-J]/.test(coordinate)) {
      convertedCoordinate = convertCoordinate(coordinate)
    } else {
      convertedCoordinate = coordinate
    }

    let row = puzzleString.slice(convertedCoordinate[0] * 9, (convertedCoordinate[0] * 9) + 9)
    row = row.slice(0, convertedCoordinate[1]) + row.slice(Number(convertedCoordinate[1]) + 1, 9)
    if (row.includes(value)) {
      return 'Invalid'
    } else {
      return 'Valid'
    }
  }

  checkColPlacement(puzzleString, coordinate, value) {
    let convertedCoordinate
    if (/[A-J]/.test(coordinate)) {
      convertedCoordinate = convertCoordinate(coordinate)
    } else {
      convertedCoordinate = coordinate
    }

    let column = []
    for (let i = 0; i < 9; i++) {
      if (i == convertedCoordinate[0]) continue
      column.push(puzzleString[(i * 9) + Number(convertedCoordinate[1])])
    }

    if (column.includes(String(value))) {
      return 'Invalid'
    } else {
      return 'Valid'
    }
  }

  checkRegionPlacement(puzzleString, coordinate, value) {
    let convertedCoordinate
    if (/[A-J]/.test(coordinate)) {
      convertedCoordinate = convertCoordinate(coordinate)
    } else {
      convertedCoordinate = coordinate
    }
    convertedCoordinate = String(Math.floor(convertedCoordinate[0] / 3) * 3) + String(Math.floor(convertedCoordinate[1] / 3) * 3)

    let region = []
    for (let i = Number(convertedCoordinate[0]); i < Number(convertedCoordinate[0]) + 3; i++) {
      for (let j = Number(convertedCoordinate[1]); j < Number(convertedCoordinate[1]) + 3; j++) {
        if (i == convertCoordinate(coordinate)[0] &&
          j == convertCoordinate(coordinate)[1]) {
          continue
        }

        region.push(puzzleString[(i * 9) + j])
      }
    }

    if (region.includes(String(value))) {
      return 'Invalid'
    } else {
      return 'Valid'
    }
  }

  solve(puzzleString) {
    let validation = this.validate(puzzleString)
    if (validation !== 'Valid') {
      return validation
    }

    // insert the backtracking algo below
    let result = puzzleString.match(/\./g)
    const numOfBlanks = result.length

    class Insert {
      constructor(value, index) {
        this.value = value
        this.index = index
      }
    }
    const inserts = []
    let index = 0
    let output = puzzleString
    let backtrackValue
    while (inserts.length !== numOfBlanks) {
      if (inserts.length === 81) {
        // console.log(inserts)
        break
      }

      if (puzzleString[index] !== '.') {
        index++
        continue
      }

      let count = 0
      if (backtrackValue === undefined) {
        for (let i = 1; i < 10; i++) {
          count++
          let coordinate = String(Math.floor(index / 9)) + (index % 9)
          if (this.checkColPlacement(output, coordinate, i) === 'Valid' &&
            this.checkRegionPlacement(output, coordinate, i) === 'Valid' &&
            this.checkRowPlacement(output, coordinate, i) === 'Valid') {
            inserts.push(new Insert(i, index))
            output = output.slice(0, index) + i + output.slice(index + 1, output.length)
            index++
            count = 0
            break
          }
        }
      } else {
        count = backtrackValue - 1
        for (let i = backtrackValue; i < 10; i++) {
          count++
          let coordinate = String(Math.floor(index / 9)) + (index % 9)
          if (this.checkColPlacement(output, coordinate, i) === 'Valid' &&
            this.checkRegionPlacement(output, coordinate, i) === 'Valid' &&
            this.checkRowPlacement(output, coordinate, i) === 'Valid') {
            inserts.push(new Insert(i, index))
            output = output.slice(0, index) + i + output.slice(index + 1, output.length)
            index++
            count = 0
            backtrackValue = undefined
            break
          }
        }
      }

      if (count === 9 &&
        inserts.length > 0) {
        // backtrack
        backtrackValue = inserts[inserts.length - 1].value + 1
        output = output.slice(0, inserts[inserts.length - 1].index) + puzzleString.slice(inserts[inserts.length - 1].index, 81)
        index = inserts[inserts.length - 1].index
        inserts.pop()
      } else if (count === 9 &&
        inserts.length === 0) {
        output = 'Puzzle cannot be solved'
        break
      }
    }

    return output
  }
}

module.exports = SudokuSolver;