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
    var footer = $('footer')
    footer.css('opacity', '1')
    footer.html('Could not connect. '
      + '<a href=javascript:location.reload()>Retry?</a>')
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
            + '\' style=\'opacity: 0;\'>Downloading peer</div>'
          )
          $('.peer-'+ conn.peer).fadeTo(0, 1)
          callback(conn, totalPeers)
        } else log('authCode rejected')
      })
    })
  })
}
Connection.prototype.acceptData = function(callback) {
  log('Connection.prototype.acceptData()')
  var that = this
  var sendACKs = function (data) {
    that.conn.send('ACK')
    callback(data)
  }
  this.conn.on('open', function () {
    that.conn.send(authCode)
    that.conn.on('data', sendACKs)
  })
  this.conn.on('close', function () {
<<<<<<< HEAD
<<<<<<< HEAD
    setTimeout(250, function () {
      if (! received) {
        var footer = $('footer')
        footer.css('opacity', '1')
        footer.html('Connection lost. '
          + '<a href=javascript:location.reload()>Retry?</a>')
      }
    })
=======
=======
>>>>>>> fe3b859... added "connection lost" error on receivers side
    var footer = $('footer')
    footer.css('opacity', '1')
    footer.html('Connection lost. '
      + '<a href=javascript:location.reload()>Retry?</a>')
<<<<<<< HEAD
>>>>>>> fe3b859... added "connection lost" error on receivers side
=======
>>>>>>> fe3b859... added "connection lost" error on receivers side
  })
}
Connection.prototype.send = function(data) {
  log('Connection.prototype.send(...)')
  this.conn.send(data)
}
Connection.prototype.putOwnID = function(selector) {
  log('Connection.prototype.putOwnID('+ selector +')')
  this.peer.on('open', function(id) {
    var url = window.location.href.toString()
    var idx = url.indexOf("#")
    var anchor = (idx !== -1) ? true : false
    $(selector).val(url
      + (anchor ? "" : '#')
      + id +':'+ authCode +':'+ password)
  })
}
Connection.prototype.disconnect = function() {
  log('Connection.prototype.disconnect')
  this.peer.disconnect()
}
module.exports = Connection
