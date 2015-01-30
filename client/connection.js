Ptr = function(callback) {
  log('new Ptr()')
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
Ptr.prototype.connect = function(id) {
  log('Ptr.prototype.connect('+ id +')')
  this.conn = this.peer.connect(id)
}
Ptr.prototype.acceptConnections = function(callback) {
  log('Ptr.prototype.acceptConnections(...)')
  var that = this
  this.peer.on('connection', function(conn) {
    that.conn = conn
    that.conn.on('open', function() {
      log('Incoming: '+ that.conn.peer)
      callback()
    })
  })
}
Ptr.prototype.acceptData = function(callback) {
  log('Ptr.prototype.acceptData()')
  var that = this
  this.conn.on('open', function() {
    that.conn.on('data', callback)
  })
}
Ptr.prototype.send = function(data) {
  log('Ptr.prototype.send(...)')
  this.conn.send(data)
}
Ptr.prototype.putOwnID = function(selector) {
  log('Ptr.prototype.putOwnID('+ selector +')')
  this.peer.on('open', function(id) {
    $(selector).val(document.URL +'#'+ id +':'+ password)
  })
}
Ptr.prototype.disconnect = function() {
  log('Ptr.prototype.disconnect')
  this.peer.disconnect()
}
