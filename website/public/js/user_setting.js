//-------------------------------user icon-------------------------
$(function() {
	function listenIcon(inputElement, formElement, imgElement) {
		inputElement.change(function() {
			var file = this.files[0];

			if (!validateIcon(file.name)) return;
			if (file.size > 5000000) {
				alert('file size should less than 5M');
				return;
			}
			//Your validation

			if (file) {
				var formData = new FormData(formElement[0]);
				$.ajax({
					url: '/API/u/' + userid + '/icon', //Server script to process data
					type: 'POST',
					xhr: function() { // Custom XMLHttpRequest
						var myXhr = $.ajaxSettings.xhr();
						if (myXhr.upload) { // Check if upload property exists
							myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
						}
						return myXhr;
					},
					//Ajax events		 
					success: function(data) {
						if (data.state == 'error')
							alert(data.message);
						else {
							$('#userSettingIcon').attr("src", '/' + data.user.icon);
							$('#userIconSidenav').attr("src", '/' + data.user.icon);
						}
					},
					// Form data
					data: formData,
					//Options to tell jQuery not to process data or worry about content-type.
					cache: false,
					contentType: false,
					processData: false
				});
			}

		});
	}

	listenIcon($('#iconUpload'), $('#iconForm'), $('#userSettingIcon'));
	listenIcon($('#iconUploadSidenav'), $('#iconFormSidenav'), $('#userIconSidenav'));
	/*
	$('#iconUpload').change(function(){
    	var file = this.files[0];
    	
    	if(!validateIcon()) return;
    	if(file.size > 5000000){
    		alert('file size should less than 5M');
    		return;
    	}
    	//Your validation
    	
    	if(file) {
    		var formData = new FormData($('#iconForm')[0]);    		
		    $.ajax({
		        url: '/API/u/'+uid+'/icon',  //Server script to process data
		        type: 'POST',
		        xhr: function() {  // Custom XMLHttpRequest
		            var myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload){ // Check if upload property exists
		                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
		            }
		            return myXhr;
		        },
		        //Ajax events		 
		        success: function(data){
		        	if(data.state == 'error')
		        		alert(data.message);
		        	else{
		        		$("#userSettingIcon").attr("src", '/'+data.user.icon);
		        	}		        					
		        },
		        // Form data
		        data: formData,
		        //Options to tell jQuery not to process data or worry about content-type.
		        cache: false,
		        contentType: false,
		        processData: false
		    });
    	}
    	
	});
	*/
	function validateIcon(name) {
		var allowedExtension = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
		var fileExtension = name.split('.').pop().toLowerCase();
		var isValidFile = false;

		for (var index in allowedExtension) {

			if (fileExtension === allowedExtension[index]) {
				isValidFile = true;
				break;
			}
		}

		if (!isValidFile) {
			alert('Allowed Extensions are : *.' + allowedExtension.join(', *.'));
		}

		return isValidFile;
	}

	function progressHandlingFunction(e) { //not used here
		if (e.lengthComputable) {
			$('#iconProgress').attr({
				value: e.loaded,
				max: e.total
			});
		}
	}
});


//-------------------------------user info-------------------------

$(function() {
	$('#userSettingBirthday').datepicker({
		format: 'yyyy-mm-dd',
		startDate: '1990-01-01',
	})
});

$(function() {
	$('#set-setting-button').click(function() {
		var name = $('#user-name-input').val();
		var birthday = $('#userSettingBirthday').val();
		var phone = $('#user-tel-input').val();
		if (!name || name.length < 1) {
			alert('name can not less than 1');
		}
		$.ajax({
			type: 'PUT',
			url: '/API/u',
			dataType: 'json',
			data: {
				name: name,
				phone: phone,
				birthday: birthday
			},
			success: function(data) {

				if (data.state === 'error')
					alert('error! ' + data.message);
				if (data.state === 'success') {
					window.location.reload();
				}
			}
		});
	})
});
//-----------------------------pass --------------------------
$(function() {
	$('#change-password-button').click(function() {
		var newpass = $('#user-newpass-input').val();
		if (!newpass || newpass.length < 6) {
			alert('new password not valid!');
			return;
		}
		$.ajax({
			type: 'PUT',
			url: '/API/u/pw',
			dataType: 'json',
			data: {
				password: newpass
			},
			success: function(data) {

				if (data.state === 'error')
					alert('error! ' + data.message);
				if (data.state === 'success') {
					alert('success');
				}
			}
		});
	})
})