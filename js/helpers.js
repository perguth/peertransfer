var helpers = {}

helpers.visualReadyStatus = function () {
  $('#step1 .button').attr('class', 'button green send')
  setTimeout(function() {
    $('#step1 .button').html('send a file')
    $('#step1 .button').toggleClass('send')
    $('#step1 .button').toggleClass('browse')
  }, 100)
}
helpers.generateRandomString = function () {
  return Math.random().toString(36).slice(-8)
}
helpers.parseAnchor = function () {
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
helpers.binaryToBlob = function (data) {
  // See http://stackoverflow.com/a/10473992
  var raw_data = atob(data.split(',')[1])
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
  return blob
}
helpers.step = function (i) {
  if (i == 1) back.fadeOut()
  else back.fadeIn()
  stage.css('top',(-(i-1)*100)+'%')
}
helpers.checkValidity = function (file) {
  if (!/^data:/.test(file)){
    return false
  } else return true
}
helpers.sendOnIncoming = function (conn, file, password) {
  conn.acceptConnections(function() {
    helpers.sendFileInChunks(conn, file, password)
  })
}
helpers.sendFileInChunks = function (conn, file, password) {
  log('helpers.sendFileInChunks()')
  var file_size = file.size
  log('File size: '+ file_size)
  var chunk_size = 16300 // Taken from PeeJS
  var range_start = 0
  var range_end = chunk_size
  var chunk
  var index = 0
  var done = false
  transfer.outgoing(conn, {
    index: index++,
    file_name: file.name,
    total: Math.ceil(file_size/chunk_size)
  }, password)
  var sendChunkObject = function(index, data) {
    chunk = {
      index: index,
      data: data
    }
    transfer.outgoing(conn, chunk, password)
    loopOverChunks()
  }
  var loopOverChunks = function () {
    if ( ! done) {
      log('Chunking while()')
      if (range_end > file_size) {
        done = true
        range_end = file_size
      }
      (helpers.blobToDataURL)( // TODO: need IIFE right?!
        index++,
        file.slice(range_start, range_end),
        sendChunkObject)

      range_start += chunk_size
      range_end += chunk_size
      if (range_end === file_size) done = true
    }
  }
  loopOverChunks()
}
helpers.blobToDataURL = function (index, blob, callback) {
  var reader = new FileReader()
  reader.onload = function(e) {
    log(e.target.result)
    callback(index, e.target.result)
  }
  reader.readAsDataURL(blob)
}

module.exports = helpers
