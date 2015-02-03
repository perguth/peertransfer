var log = require('./debug.js')
var Peer = require('peerjs')

var Connection = function(callback) {
  log('new Connection()')
  this.conn = {}
  this.peer = new Peer({
    host: HOST,
    port: PORT,
    key: API_KEY,
    secure: SSL? true:false,
    debug: DEBUG? 2:0,
  })
  this.peer.on('open', callback)
}
Connection.prototype.connect = function(id) {
  log('Connection.prototype.connect('+ id +')')
  this.conn = this.peer.connect(id)
}
Connection.prototype.acceptConnections = function(callback) {
  log('Connection.prototype.acceptConnections(...)')
  var that = this
  this.peer.on('connection', function(conn) {
    that.conn = conn
    that.conn.on('open', function() {
      log('Incoming: '+ that.conn.peer)
      callback()
    })
  })
}
Connection.prototype.acceptData = function(callback) {
  log('Connection.prototype.acceptData()')
  var that = this
  this.conn.on('open', function() {
    that.conn.on('data', callback)
  })
}
Connection.prototype.send = function(data) {
  log('Connection.prototype.send(...)')
  this.conn.send(data)
}
Connection.prototype.putOwnID = function(selector) {
  log('Connection.prototype.putOwnID('+ selector +')')
  this.peer.on('open', function(id) {
    $(selector).val(document.URL +'#'+ id +':'+ password)
  })
}
Connection.prototype.disconnect = function() {
  log('Connection.prototype.disconnect')
  this.peer.disconnect()
}
module.exports = Connection
