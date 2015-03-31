Connection = require('./js/connection')
var helpers = require('./js/helpers')
var log = require('./js/debug')
sjcl = require('sjcl')
$ = require('jquery')

// config:
DEBUG = true
chunk_size = 16300 // Taken from PeerJS
anchor = ''
peerID = ''
dataEnc = ''
password = ''
authCode = ''
stopTransfer = function () { return false }
totalDownloads = 0
totalPeers = 0
encrypted_chunks = []

transfer = {}
var file_name
var total
//var complete_file = 'data:application/octet-stream;base64,'
var complete_file = []
var counter = 1

if (
  SSL
  && window.location.protocol != "https:"
  && window.location.protocol != "file:"
) window.location.href = "https:" + window.location.href.substring(window.location.protocol.length)

transfer.incoming = function(enc) {
  decrypted = JSON.parse(sjcl.decrypt(password, enc))

  if (decrypted.index === 0) {
    file_name = decrypted.file_name
    total = decrypted.total
    log('Total Chunks: '+ total)
    var downloadBar = $('#step2 .button')
    downloadBar.css('background-repeat', 'no-repeat')
    downloadBar.css('background-position', '-240px 0')
    downloadBar.css('background-image', 'url(green.png)')
  } else {
    log('Receving chunk #'+ decrypted.index +' of '+ total)
    //log(decrypted)
    if (helpers.checkValidity(decrypted.data)) {
      var index = decrypted.index
      if (counter < total) {
        //complete_file += decrypted.data.split(',')[1].slice(0, -2)
        complete_file[index-1] = helpers.binaryToBlob(decrypted.data)
        counter++
        $('#step2 .button').css('background-position',
          '-'+ Math.ceil(240 - counter/total * 240) +'px 0')
      } else {
        //complete_file += decrypted.data.split(',')[1]
        complete_file[index-1] = helpers.binaryToBlob(decrypted.data)
        var blob = new Blob(complete_file)
        url = (window.webkitURL || window.URL).createObjectURL(blob)
        log(url)
        $('#step3 a').attr('href', url)
          .attr('download', file_name)
        helpers.step(3)
        setTimeout(function() {
          document.getElementById('downloadLink').click()
        }, 300)
        complete_file = []
      }
    } else {
      log(decrypted.chunk)
      alert('Invalid pass phrase or file!')
      helpers.step(1)
    }
  }
}
transfer.outgoing = function(ptr, file, password) {
  log('transfer.outgoing()')
  //log(file)

  ptr.send(sjcl.encrypt(password, JSON.stringify(file)))
}

// hook UI events:
$(require('./js/events'))

// connect to broker server:
ptr = helpers.connectToBroker()

// if receiver, connect to sender and receive data:
if (anchor) {
  ptr.connect(peerID)
  ptr.acceptData(function(enc) {
    transfer.incoming(enc)
  })

  // update UI:
  setTimeout(function() {
    body.attr('class', 'receive')
    helpers.step(2)
  }, 200)
}
