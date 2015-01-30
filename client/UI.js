$(function(){

	body = $('body')
	stage = $('#stage')
	back = $('a.back')
	var file = null
	var url = ''

	$('#step1 .button').click(function(){
		$('#send-input').click()
	})
	$('#step1').on('change', '#send-input', function(e){
		body.attr('class', 'send')
		step(2)
		sendOnIncoming(ptr, e.target.files[0], password)
	})
	back.click(function() { // The back button
		$('#step1 input[type=file]').replaceWith(function() {
			return $(this).clone() // Reinitialize the hidden file input
		})
		if (anchor) {
			window.location.hash = ''
			visualReadyStatus()
		}
		step(1)
	})
})
