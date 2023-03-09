'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (req.body.hasOwnProperty('puzzle') &&
      req.body.hasOwnProperty('coordinate') &&
      req.body.hasOwnProperty('value')) {
        let output = solver.validate(req.body.puzzle)
        if (output === 'Invalid characters in puzzle') {
          res.json({
            error: 'Invalid characters in puzzle'
          })
        } else if (output === 'Expected puzzle to be 81 characters long') {
          res.json({
            error: 'Expected puzzle to be 81 characters long'
          })
        } else if (!/^[A-I][1-9]$/.test(req.body.coordinate)) {
          res.json({
            error: 'Invalid coordinate'
          })
        } else if (!/^[1-9]$/.test(req.body.value)) {
          res.json({
            error: 'Invalid value'
          })
        } else {
          let conflict = []
          if (solver.checkRowPlacement(req.body.puzzle, req.body.coordinate, req.body.value) === 'Invalid') {
            conflict.push('row')
          }
          if (solver.checkColPlacement(req.body.puzzle, req.body.coordinate, req.body.value) === 'Invalid') {
            conflict.push('column')
          }
          if (solver.checkRegionPlacement(req.body.puzzle, req.body.coordinate, req.body.value) === 'Invalid') {
            conflict.push('region')
          }
    
          if (conflict.length === 0) {
            res.json({
              valid: true
            })
          } else {
            res.json({
              valid: false,
              conflict
            })
          }
        }
      } else {
        res.json({
          error: 'Required field(s) missing'
        })
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (req.body.hasOwnProperty('puzzle')) {
        let output = solver.solve(req.body.puzzle)
        if (output == 'Invalid characters in puzzle') {
          res.json({
            error: 'Invalid characters in puzzle'
          })
        } else if (output == 'Expected puzzle to be 81 characters long') {
          res.json({
            error: 'Expected puzzle to be 81 characters long'
          })
        } else if (output == 'Invalid') {
          res.json({
            error: 'Puzzle cannot be solved'
          })
        } else {
          res.json({
            solution: output
          })
        }

      } else {
        res.json({
          error: 'Required field missing'
        })
      }
    });
};
