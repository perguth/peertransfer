var Connection = require('./js/connection')
var helpers = require('./js/helpers')
var log = require('./js/debug')
sjcl = require('sjcl')
$ = require('jquery')

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

$(require('./js/events'))

conn = new Connection(function() {
  if ( ! anchor) {
    helpers.visualReadyStatus()
    password = helpers.generateRandomString() + helpers.generateRandomString()
    authCode = helpers.generateRandomString()
  }
})
conn.putOwnID('.url', authCode, password)

if (anchor)  {
  conn.connect(peerID)
  conn.acceptData(function(enc) {

    decrypted = sjcl.decrypt(password, enc)

    if (helpers.checkValidity(decrypted)) {
      url = helpers.binaryToBlob(decrypted)
      $('#step3 a').attr('href', url)
      helpers.step(3)
      setTimeout(function() {
        location.href = url // <-- Download!
      }, 300)
    } else {
      alert('Invalid pass phrase or file!')
      helpers.step(1)
    }
  })
  setTimeout(function() {
    body.attr('class', 'receive')
    helpers.step(2)
  }, 200)
}
