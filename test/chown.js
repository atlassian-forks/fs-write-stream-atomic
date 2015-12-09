'use strict'
var path = require('path')
var test = require('tap').test
var rimraf = require('rimraf')
var writeStream = require('../index.js')

var target = path.resolve(__dirname, 'test-chown')

test('chown works', function (t) {
  t.plan(1)
  var stream = writeStream(target, {chown: {uid: process.getuid(), gid: process.getgid()}})
  var hadError = false
  stream.on('error', function (er) {
    hadError = true
    console.error('#', er)
  })
  stream.on('close', function () {
    t.is(hadError, false, 'no errors before close')
  })
  stream.end()
})

test('chown fails', function (t) {
  t.plan(1)
  if (process.getuid() === 0) {
    t.pass("# SKIP - Can't test chown failures as root")
    return
  }
  var stream = writeStream(target, {chown: {uid: 0, gid: 0}})
  stream.on('error', function (er) {
    t.ok(er, 'got chown error before close')
  })
  stream.end()
})

test('cleanup', function (t) {
  rimraf.sync(target)
  t.end()
})
