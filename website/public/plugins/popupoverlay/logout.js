$(document).ready(function () {

	$('#logout').on('popup', function(){
	  	$('#logout').css('visibility', 'vissible')
	})
	  $('#logout').popup({
	    transition: 'ease-in-out 0.3s',
	    vertical: 'top'
	  });

});