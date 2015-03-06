var Connection = require('./js/connection')
var helpers = require('./js/helpers')
var log = require('./js/debug')
sjcl = require('sjcl')
$ = require('jquery')

// config:
DEBUG = true
HOST = '0.peerjs.com'
PORT = 9000
SSL = false
anchor = ''
peerID = ''
dataEnc = ''
password = ''
authCode = ''
helpers.parseAnchor()

transfer = {}
var file_name
var total
var complete_file = 'data:application/octet-stream;base64,'
transfer.incoming = function(enc) {
  log('transfer.incoming()')
  var file = ''
  decrypted = JSON.parse(sjcl.decrypt(password, enc))

  if (decrypted.index === 0) {
    file_name = decrypted.file_name
    total = decrypted.total
    log('Total chunks: '+ total)
  } else {
    log('Receving chunk #'+ decrypted.index +' of '+ total)
    log(decrypted)
    if (helpers.checkValidity(decrypted.data)) {
      if (decrypted.index < total)
        complete_file += decrypted.data.split(',')[1].slice(0, -2)
      else {
        complete_file += decrypted.data.split(',')[1]
        log('complete_file:')
        log(complete_file)
        $('#step3 a').attr('href', url = complete_file)
          .attr('download', file_name)
        helpers.step(3)
        setTimeout(function() {
          document.getElementById('downloadLink').click()
        }, 300)
      }
  /*
      file += file.split(',')[1]

      url = helpers.binaryToBlob(decrypted)
      $('#step3 a').attr('href', url)
      helpers.step(3)
      setTimeout(function() {
        location.href = url // <-- Download!
      }, 300)
  */
    } else {
      log(decrypted.chunk)
      alert('Invalid pass phrase or file!')
      helpers.step(1)
    }
  }
}
transfer.outgoing = function(ptr, file, password) {
  log('transfer.outgoing()')
  log(file)

  var enc = sjcl.encrypt(password, JSON.stringify(file))
  ptr.send(enc)
  /*
  var reader = new FileReader()
  reader.onload = function(e) {
    log(e.target.result)
    var enc = sjcl.encrypt(password, e.target.result)
    ptr.send(enc)
  }
  reader.readAsDataURL(file.data)
  */
}

// hook UI events:
$(require('./js/events'))

// connect to broker server:
conn = new Connection(function() {
  if ( ! anchor) {
    helpers.visualReadyStatus()
    password = helpers.generateRandomString() + helpers.generateRandomString()
    authCode = helpers.generateRandomString()
  }
})
conn.putOwnID('.url', authCode, password)

// if receiver, connect to sender and receive data:
if (anchor) {
  conn.connect(peerID)
  conn.acceptData(function(enc) {
    transfer.incoming(enc)
  })

  // update UI:
  setTimeout(function() {
    body.attr('class', 'receive')
    helpers.step(2)
  }, 200)
}
