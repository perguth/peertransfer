let $ = require('jquery')
let aes = require('crypto-js').AES
let Clipboard = require('clipboard')
let crypto = require('crypto')
let enc = require('crypto-js').enc.Utf8
let FileReadStream = require('namedfilestream/read')
let FileWriteStream = require('namedfilestream/write')
let signalhub = require('signalhub')
let swarm = require('webrtc-swarm')
let version = 'v' + require('./package.json').version

let file, hash, hub, key, sw, transfers
let peers = []
let hubs = process.env.NODE_ENV === 'production' ? [
  // 'https://signalhub.mafintosh.com/', // bug in lib
  'https://signalhub.thingylabs.io/'
] : 'http://localhost:7000'
hubs = process.env.HUB_URLS ? process.env.HUB_URLS.split(',') : hubs

$('#version').html(version)
attachListeners()
initialize()

function attachListeners () {
  new Clipboard('.btn') // eslint-disable-line

  window.onbeforeunload = x => reset()

  let button = $('#step1 .button')
  button.click(x => $('#send-input').click())

  $(document).on('change', '#send-input', e => {
    // the user selected a file and wants to send it
    $('.url').val(`${window.location.origin + window.location.pathname}#${key}`)
    $('body').attr('class', 'send')
    file = e.target.files[0]
    step(2)
  })

  $('a.back').click(function () {
    window.location.hash = ''
    button.off('click')
    $('#send-input').replaceWith(function () { return $(this).clone() })
    button.click(x => $('#send-input').click())
    reset()
    initialize()
  })
}

function initialize () {
  step(1)
  transfers = {
    active: 0,
    finished: 0
  }
  hash = window.location.hash.substr(1)
  key = hash || randomHex('24')
  if (!hash) bootAnimation()

  hub = signalhub(`peertransfer-${key.substr(0, 8)}`, hubs)
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
    unwrap: (data, id) => {
      if (!data.signal) return data
      try {
        data.signal = (aes.decrypt(data.signal, key)).toString(enc)
      } catch (e) { return }
      data.signal = JSON.parse(data.signal)
      return data
    }
  })
  handlePeers()
}

function handlePeers () {
  sw.on('peer', peer => {
    peers.push(peer)

    // sending file
    if (!hash) {
      step(2)
      let fileReadStream = new FileReadStream(
        file,
        { fields: ['name', 'size', 'type'] }
      )
      $('#active-transfers').html(++transfers.active)
      peer.on('close', x => {
        $('#active-transfers').html(--transfers.active)
      })
      fileReadStream.on('end', x => {
        $('#finished-transfers').html(++transfers.finished)
      })
      fileReadStream.pipe(peer)
      return
    }

    // receiving file
    let writeStream = new FileWriteStream()
    let fileMeta = {}
    writeStream.on('header', meta => {
      sw.removeAllListeners()
      $('body').attr('class', 'receive')
      step(2)
      var downloadBar = $('#step2 .button')
      downloadBar.css('background-repeat', 'no-repeat')
      downloadBar.css('background-position', '-240px 0')
      downloadBar.css('background-image', 'url(assets/green.png)')
      fileMeta = meta
    })
    writeStream.on('progress', progress => {
      if (progress >= fileMeta.size) writeStream.end()
      $('#step2 .button').css('background-position', `-${Math.ceil(240 - progress / fileMeta.size * 240)}px 0`)
    })
    peer.pipe(writeStream).on('file', file => {
      reset()
      let objectUrl = window.URL.createObjectURL(file)
      $('#step3 a').attr('href', objectUrl).attr('download', file.name)
      setTimeout(x => document.getElementById('downloadLink').click(), 400)
      step(3)
    })
  })
}

function reset () {
  peers.forEach(peer => peer.destroy())
  peers = []
  hub.close()
  sw.close()
  $('#active-transfers').html(0)
  $('#finished-transfers').html(0)
}

function bootAnimation () {
  let button = $('#step1 .button')
  button.css('cursor', 'default')
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
