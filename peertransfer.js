if (Meteor.isClient) {
  DEBUG = true

  HOST = '0.peerjs.com'
  PORT = 9000
  SSL = false

  anchor = ''
  dataEnc = ''
  password = ''
  getAnchorAndPassword()

  ptr = new Ptr(function() {
    if ( ! anchor) {
      visualReadyStatus()
      password = generatePassword()
    }
  })
  ptr.putOwnID('.url', password)

  if ( ! anchor) {
    $('#step1').on('change', '#send-input', function(e){
      body.attr('class', 'send')
      step(2)
      sendOnIncoming(ptr, e.target.files[0], password)
    })
  } else {
    ptr.connect(anchor)
    ptr.acceptData(function(enc) {

      decrypted = sjcl.decrypt(password, enc)

      if (checkValidity(decrypted)) {
        url = binaryToBlob(decrypted)
        $('#step3 a').attr('href', url)
        step(3)
        setTimeout(function() {
          location.href = url // <-- Download!
        }, 300)
      } else {
        alert('Invalid pass phrase or file!')
        step(1)
      }
    })
    setTimeout(function() {
      body.attr('class', 'receive')
      step(2)
    }, 200)
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
