let $ = require('jquery')
let signalhub = require('signalhub')
let swarm = require('webrtc-swarm')
let FileReadStream = require('namedfilestream/read')
let FileWriteStream = require('namedfilestream/write')
let crypto = require('crypto')
let aes = require('crypto-js').AES
let enc = require('crypto-js').enc.Utf8
let Clipboard = require('clipboard')

let fileReadStream = null
let hash, key, hub, sw
let peers = []

initialize()

window.onbeforeunload = x => {
  console.log('cleanup  ')
  reset()
}

$('a.back').click(function () {
  $('#total-downloads').remove()
  $('*[class*="peer"]').remove()
  $('#send-input').replaceWith(function () {
    return $(this).clone() // reinitialize the hidden file input
  })
  reset()
})

$(document).on('change', '#send-input', e => {
  // the user selected a file and wants to send it
  window.location.hash = '#'
  $('.url').val(`${window.location.origin}/#${key}`)
  $('body').attr('class', 'send')
  fileReadStream = new FileReadStream(
    e.target.files[0],
    { fields: ['name', 'size', 'type'] }
  )
  step(2)
})

document.addEventListener('DOMContentLoaded', () => {
  new Clipboard('.btn') // eslint-disable-line
})

function initialize () {
  step(1)
  hash = window.location.hash.substr(1)
  if (!hash) bootAnimation()
  key = hash || randomHex('24')
  hub = signalhub(`peertransfer-${key}`.substr(0, 7), [
    'https://signalhub.perguth.de:65300/',
    'https://signalhub.mafintosh.com/'
  ])
  sw = swarm(hub, {
    // The goal here is to protect the signaling data that's beeing exchanged
    // between peers on WebRTC connection establishment. It includes available
    // IP addresses (could be local ones!) among other things.
    wrap: (data, channel) => {
      if (!data.signal || channel === '/all') return data
      data.signal = JSON.stringify(data.signal)
      data.signal = aes.encrypt(data.signal, key).toString()
      return data
    },
    unwrap: data => {
      if (!data.signal) return data
      data.signal = (aes.decrypt(data.signal, key)).toString(enc)
      data.signal = JSON.parse(data.signal)
      return data
    }
  })
  handlePeers()
}

function reset () {
  peers.forEach(peer => peer.destroy())
  peers = []
  hub.close()
  sw.close()
  initialize()
}

function handlePeers () {
  sw.on('peer', peer => {
    peers.push(peer)
    if (!hash) {
      // sending files
      step(2)
      fileReadStream.on('end', x => {
        peer.destroy()
        peers.pop(peer)
      })
      fileReadStream.pipe(peer)
      return
    }
    // receiving files
    let writeStream = new FileWriteStream()
    writeStream.on('finish', x => {
      sw.close()
      peer.destroy()
      peers.pop(peer)
    })
    peer.pipe(writeStream).on('file', file => {
      let objectUrl = window.URL.createObjectURL(file)
      $('#step3 a').attr('href', objectUrl).attr('download', file.name)
      step(3)
    })
  })
}

function bootAnimation () {
  let button = $('#step1 .button')
  button.css('cursor', 'pointer')
  button.click(function () {
    $('#send-input').click()
  })
  setTimeout(function () {
    button.attr('class', 'button green send')
    button.html('send a file')
    button.toggleClass('send')
    button.toggleClass('browse')
    button.css('cursor', 'pointer')
  }, 200)
}

function step (i) {
  let stage = $('#stage')
  let back = $('a.back')
  if (i === 1) back.fadeOut()
  else $('a.back').fadeIn()
  stage.css('top', (-(i - 1) * 100) + '%')
}

function randomHex (len) {
  // https://github.com/mafintosh/webrtc-swarm/commit/ce77175c7d48cf4fad11c5e40f8869ebf0d7f303#diff-1dd241c4cd3fd1dd89c570cee98b79dd
  return crypto.randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len)
}