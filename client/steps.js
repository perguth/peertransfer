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
	if (anchor) { // connect and receive file:
		ptr.connect(anchor)
		ptr.acceptData(function(enc) {
			decrypted = sjcl.decrypt(password, enc)
			if (checkValidity(decrypted)) {
				url = binaryToBlob(decrypted)
				$('#step3 a').attr('href', url)
				step(3)
				setTimeout(function() {
					location.href = url; // <-- Download!
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
	/* The back button */
	back.click(function() {
		$('#step1 input[type=file]').replaceWith(function() {
			// Reinitialize the hidden file input
			return $(this).clone()
		})
		if (anchor) {
			window.location.hash = ''
			visualReadyStatus()
		}
		step(1)
	});
});
