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
    debug: DEBUG? 3:0,
  })
  this.peer.on('open', callback)
  this.peer.on('error', function () {
    $('footer').css('opacity', '1')
    $('footer').html('Could not connect. <a href=javascript:location.reload()>Retry?</a>')
  })
}
Connection.prototype.connect = function(id) {
  log('Connection.prototype.connect('+ id +')')
  this.conn = this.peer.connect(id, {reliable: true})
}
Connection.prototype.acceptConnections = function(callback) {
  log('Connection.prototype.acceptConnections(...)')
  this.peer.on('connection', function(conn) {
    conn.on('open', function() {
      log('Incoming: '+ conn.peer)
      conn.on('data', function (receivedAuthCode) {
        log('Auth Code received: '+ receivedAuthCode)
        if (receivedAuthCode === authCode) {
          totalPeers++
          $('.request-activity').after(
            '<div class=\'button red receive requesting-peer peer-'
            + conn.peer
            + '\'>Downloading peer</div>'
          )
          callback(conn, totalPeers)
        } else log('authCode rejected')
      })
    })
  })
}
Connection.prototype.acceptData = function(callback) {
  log('Connection.prototype.acceptData()')
  var that = this
  this.conn.on('open', function() {
    that.conn.send(authCode)
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
    $(selector).val(document.URL +'#'+ id +':'+ authCode +':'+ password)
  })
}
Connection.prototype.disconnect = function() {
  log('Connection.prototype.disconnect')
  this.peer.disconnect()
}
module.exports = Connection
