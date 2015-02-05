var exports = {}

exports.visualReadyStatus = function() {
  $('#step1 .button').attr('class', 'button green send')
  setTimeout(function() {
    $('#step1 .button').html('send a file')
    $('#step1 .button').toggleClass('send')
    $('#step1 .button').toggleClass('browse')
  }, 100)
}
exports.generateRandomString = function() {
  return Math.random().toString(36).slice(-8)
}
exports.parseAnchor = function() {
  var url = window.location.href.toString()
  var idx = url.indexOf("#")
  anchor = (idx != -1) ? url.substring(idx+1) : ""
  log('Anchor found: '+ anchor)

  if (anchor) {
    var parts = anchor.split(':')
    password = parts[2]
    authCode = parts[1]
    peerID = parts[0]
  }
}
exports.binaryToBlob = function(decrypted) {
  // See http://stackoverflow.com/a/10473992
  var raw_data = atob(decrypted.split(',')[1])
  // Use typed arrays to convert the binary data to a Blob
  var arraybuffer = new ArrayBuffer(raw_data.length)
  var view = new Uint8Array(arraybuffer)
  for (var i=0; i<raw_data.length; i++) {
    view[i] = raw_data.charCodeAt(i) & 0xff
  }
  try {
    // This is the recommended method:
    var blob = new Blob([arraybuffer], {type: 'application/octet-stream'})
  } catch (e) {
    // The BlobBuilder API has been deprecated in favour of Blob, but older
    // browsers don't know about the Blob constructor
    var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)
    bb.append(arraybuffer)
    var blob = bb.getBlob('application/octet-stream') // <-- Here's the Blob
  }
  // Use the URL object to create a temporary URL
  url = (window.webkitURL || window.URL).createObjectURL(blob)
  return url
}
exports.sendOnIncoming = function(ptr, file, password) {
  ptr.acceptConnections(function() {
    var reader = new FileReader()
    reader.onload = function(e){
      log(e.target.result)
      var enc = sjcl.encrypt(password, e.target.result)
      ptr.send(enc)
    };
    reader.readAsDataURL(file)
  })
}
exports.step = function(i) {
  if (i == 1) back.fadeOut()
  else back.fadeIn()
  stage.css('top',(-(i-1)*100)+'%')
}
exports.checkValidity = function(file) {
  if (!/^data:/.test(file)){
    return false
  } else return true
}

module.exports = exports
