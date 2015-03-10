var helpers = require('./helpers')

var events = function(){

  body = $('body')
  stage = $('#stage')
  back = $('a.back')
  var file = null
  var url = ''

  var url = location.href
  if ( ! SSL && url.split('://')[0] === 'https') {
    $('footer').css('opacity', '1')
    $('footer').html("You need to use HTTP. This is just as secure since we use end-to-end encryption. <a href='' id=reloadUsingHTTP>Use HTTP</a>")
    $('#reloadUsingHTTP').prop('href',
      'http://' + url.split('://')[1]
    )
  }

  $('#step1 .button').css('cursor', 'default')
  $('#step1').on('change', '#send-input', function(e){
    helpers.sendOnIncoming(conn, e.target.files[0], password)
    body.attr('class', 'send')
    helpers.step(2)
  })
  back.click(function() { // The back button
    stopTransfer = function () { return true }
    helpers.connectToBroker('reconnect')
    totalDownloads = 0
    $('#total-downloads').remove()
    $('*[class*="peer"]').remove()
    $('#send-input').replaceWith(function() {
      return $(this).clone() // Reinitialize the hidden file input
    })
    if (anchor) {
      window.location.hash = ''
      helpers.visualReadyStatus()
    }
    helpers.step(1)
  })

}
module.exports = events
