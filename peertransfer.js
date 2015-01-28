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

  // -> client/steps.js
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
