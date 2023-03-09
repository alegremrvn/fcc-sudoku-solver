const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('/api/solve', function () {
    test('Solve a puzzle with valid puzzle string', function (done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: input
        })
        .end(function (err, res) {
          assert.equal(res.body.solution, output);

          done()
        })
    })

    test('Solve a puzzle with missing puzzle string', function (done) {
      chai.request(server)
        .post('/api/solve')
        .send({
          notpuzzle: 'something'
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Required field missing')

          done()
        })
    })

    test('Solve a puzzle with invalid characters', function (done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a'

      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: input
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Invalid characters in puzzle')

          done()
        })
    })

    test('Solve a puzzle with incorrect length', function (done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.7'

      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: input
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')

          done()
        })
    })

    test('Solve a puzzle that cannot be solved', function (done) {
      let input =  '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: input
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Puzzle cannot be solved')

          done()
        })
    })
  })

  suite('/api/check', function () {
    test('Check a puzzle placement with all fields', function (done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'A1'
      const value = '7'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.isTrue(res.body.valid)

          done()
        })
    })

    test('Check a puzzle placement with single placement conflict', function (done) {
      const input = '1...............................................................................1'
      const coordinate = 'B2'
      const value = '1'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.isFalse(res.body.valid)
          assert.include(res.body.conflict, 'region')
          assert.equal(res.body.conflict.length, 1)

          done()
        })
    })

    test('Check a puzzle placement with multiple placement conflicts', function (done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1'
      const value = '1'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.isFalse(res.body.valid)
          assert.include(res.body.conflict, 'row')
          assert.include(res.body.conflict, 'column')
          assert.equal(res.body.conflict.length, 2)

          done()
        })
    })

    test('Check a puzzle placement with all placement conflicts', function (done) {
      const input = '1............1..............1...................................................1'
      const coordinate = 'B2'
      const value = '1'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.isFalse(res.body.valid)
          assert.include(res.body.conflict, 'region')
          assert.include(res.body.conflict, 'row')
          assert.include(res.body.conflict, 'column')
          assert.equal(res.body.conflict.length, 3)

          done()
        })
    })

    test('Check a puzzle placement with missing required fields', function (done) {
      let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      let value = '1'
      
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle,
          value
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Required field(s) missing')

          done()
        })
      })
      
    test('Check a puzzle placement with invalid characters', function (done) {
      const input = 'A............1..............1...................................................1'
      const coordinate = 'A2'
      const value = '2'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Invalid characters in puzzle')

          done()
        })
    })

    test('Check a puzzle placement with incorrect length', function (done) {
      const puzzle = '...........................'
      const coordinate = 'A1'
      const value = '2'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')

          done()
        })
    })

    test('Check a puzzle placement with invalid placement coordinate', function (done) {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'Z1'
      const value = '7'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Invalid coordinate')

          done()
        })
    })

    test('Check a puzzle placement with invalid placement value', function (done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const coordinate = 'A1'
      const value = 'S'

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'Invalid value')

          done()
        })
    })
  })
});

