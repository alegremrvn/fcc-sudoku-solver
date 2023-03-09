const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzlesAndSolutions = require('../controllers/puzzle-strings');
const { suite } = require('mocha');
let solver = new Solver();

let periodArray = []
for (let i = 0; i < 81; i++) {
  periodArray.push('.')
}
let blankPuzzle = periodArray.join('')

suite('Unit Tests', () => {
  suite('validate method', function () {
    test('Logic handles a valid puzzle string of 81 characters', function () {
      assert.equal(solver.validate(puzzlesAndSolutions[0][0]), 'Valid')
      assert.equal(solver.validate(puzzlesAndSolutions[1][0]), 'Valid')
      assert.equal(solver.validate(puzzlesAndSolutions[2][0]), 'Valid')
      assert.equal(solver.validate(puzzlesAndSolutions[3][0]), 'Valid')
      assert.equal(solver.validate(puzzlesAndSolutions[4][0]), 'Valid')
    })

    test('Logic handles a puzzle string with invalid characters (not 1-9 or `.`)  ', function () {
      let invalidSample1 = blankPuzzle.slice(0, 80) + ','
      assert.equal(solver.validate(invalidSample1), 'Invalid characters in puzzle')

      let invalidSample2 = blankPuzzle.slice(0, 80) + 'a'
      assert.equal(solver.validate(invalidSample2), 'Invalid characters in puzzle')

      let invalidSample3 = 'A' + blankPuzzle.slice(0, 80)
      assert.equal(solver.validate(invalidSample3), 'Invalid characters in puzzle')
    })

    test('Logic handles a puzzle string that is not 81 characters in length', function () {
      let invalidSample1 = '..'
      assert.equal(solver.validate(invalidSample1), 'Expected puzzle to be 81 characters long')
    })
  })

  suite('checkRowPlacement method', function () {
    test('Logic handles a valid row placement', function () {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.equal(solver.checkRowPlacement(puzzle, 'A1', 7), 'Valid')
      assert.equal(solver.checkRowPlacement(puzzle, 'C6', 8), 'Valid')
    })

    test('Logic handles an invalid row placement', function () {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.equal(solver.checkRowPlacement(puzzle, 'A1', 5), 'Invalid')
      assert.equal(solver.checkRowPlacement(puzzle, 'C6', 4), 'Invalid')
    })
  })

  suite('checkColPlacement method', function () {
    test('Logic handles a valid column placement', function () {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.equal(solver.checkColPlacement(puzzle, 'A1', 7), 'Valid')
      assert.equal(solver.checkColPlacement(puzzle, 'C6', 8), 'Valid')
    })

    test('Logic handles an invalid column placement', function () {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.equal(solver.checkColPlacement(puzzle, 'A1', 6), 'Invalid')
      assert.equal(solver.checkColPlacement(puzzle, 'C6', 4), 'Invalid')
    })
  })

  suite('checkRegionPlacement method', function () {
    test('Logic handles a valid region (3x3 grid) placement', function () {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      assert.equal(solver.checkRegionPlacement(puzzle, 'A1', 7), 'Valid')
      assert.equal(solver.checkRegionPlacement(puzzle, 'C6', 8), 'Valid')
    })
  
    test('Logic handles an invalid region (3x3 grid) placement', function () {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      let puzzle2 = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
      assert.equal(solver.checkRegionPlacement(puzzle, 'A1', 9), 'Invalid')
      assert.equal(solver.checkRegionPlacement(puzzle, 'C6', 4), 'Invalid')
      assert.equal(solver.checkRegionPlacement(puzzle2, 'A9', 8), 'Invalid')
    })
  })

  suite('solve method' ,function() {
    test('Valid puzzle strings pass the solver', function () {
      assert.equal(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1])
      assert.equal(solver.solve(puzzlesAndSolutions[1][0]), puzzlesAndSolutions[1][1])
      assert.equal(solver.solve(puzzlesAndSolutions[2][0]), puzzlesAndSolutions[2][1])
      assert.equal(solver.solve(puzzlesAndSolutions[3][0]), puzzlesAndSolutions[3][1])
      assert.equal(solver.solve(puzzlesAndSolutions[4][0]), puzzlesAndSolutions[4][1])
    })
  
    test('Invalid puzzle strings fail the solver', function () {
      assert.equal(solver.solve('..'), 'Expected puzzle to be 81 characters long')
      assert.equal(solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a'), 'Invalid characters in puzzle')
    })
  
    test('Solver returns the expected solution for an incomplete puzzle', function () {
      assert.equal(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1])
      assert.equal(solver.solve(puzzlesAndSolutions[1][0]), puzzlesAndSolutions[1][1])
      assert.equal(solver.solve(puzzlesAndSolutions[2][0]), puzzlesAndSolutions[2][1])
      assert.equal(solver.solve(puzzlesAndSolutions[3][0]), puzzlesAndSolutions[3][1])
      assert.equal(solver.solve(puzzlesAndSolutions[4][0]), puzzlesAndSolutions[4][1])
    })
  })
});
