var g_project;
$(function(){

	function loadProject(){
		$.ajax({
	        type: 'GET',
	        url: '/API/p/'+projectid,
	        dataType: 'json',        
	        success: function(data){

	            if(data.state === 'error')
	                alert('error! '+ data.message);
	            if(data.state === 'success')
	            {                                  
	                g_project = data.project;
	                $('body').trigger('loadUserList');
	            }
	        }            
	    });
	}
	function loadUserList(){
		$.ajax({
            type: 'GET',
            url: '/API/u/name/',
            dataType: 'json',            
            success: function(data){
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                                  
                    data.user.forEach(function(u){
                    	if(_.findWhere(g_project.members, {'_id':u._id})) return;
                    	if(g_project.owner._id == u._id) return;
                    	var opt = $('<option >',{'value':u._id}).text(u.name);
                    	//var opt = $('<option >',{'value':'avoid'}).text('avoid');
                    	opt.appendTo($('#search-member-box'));
                    })
                    $('#search-member-box').combobox();
                }
            }            
        });
	}
	$('body').on('loadProject',loadProject);
	$('body').on('loadUserList',loadUserList);
	$('body').trigger('loadProject');
})
$(function(){

	$('#project-setting-button').click(function(){
		var name = $('#project-name-input').val();
		if(!name) {
			alert('need a name');
			return;
		}
		$.ajax({
            type: 'PUT',
            url: '/API/p/'+projectid,
            dataType: 'json',
            data:{
            	name: name,
            	des: $('#project-description-input').val(), 	
            },
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                                  
                    window.location.reload();
                }
            }            
        });
	})
})
$(function(){
	$('#add-member-id-button').click(function(){
		var uid = $('#search-member-box').val();
		if(uid){
			//post /API/p/:pid/mid/:uid
			$.ajax({
            type: 'POST',
            url: '/API/p/'+projectid+'/mid/'+uid,
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {   
                	alert('success');                               
                    window.location.reload();
                }
            }            
        });
		}
	})
})

$(function(){
	$('.set-admin-button').click(function(){
		//alert($(this).attr('uid'));
		var mid = $(this).attr('uid');
		if(mid){
			//put     /API/p/:pid/ma/:uid
			$.ajax({
            type: 'PUT',
            url: '/API/p/'+projectid+'/ma/'+mid,
            dataType: 'json',            
            success: function(data){

	                if(data.state === 'error')
	                    alert('error! '+ data.message);
	                if(data.state === 'success') {
	                	alert('success');                               
	                    window.location.reload();
	                }
	            }  
	        });
		}
	});
	$('.delete-member-button').click(function(){
		//alert($(this).attr('uid'));
		var mid = $(this).attr('uid');
		if(mid){
			//delete  /API/p/:pid/mid/:uid
			$.ajax({
            type: 'DELETE',
            url: '/API/p/'+projectid+'/mid/'+mid,
            dataType: 'json',            
            success: function(data){

	                if(data.state === 'error')
	                    alert('error! '+ data.message);
	                if(data.state === 'success') {
	                	alert('success');                               
	                    window.location.reload();
	                }
	            }  
			});
		}
	});
	$('.unset-admin-button').click(function(){
		//alert($(this).attr('uid'));
		var mid = $(this).attr('uid');
		if(mid){
			//delete  /API/p/:pid/mid/:uid
			$.ajax({
            type: 'DELETE',
            url: '/API/p/'+projectid+'/ma/'+mid,
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success') {
                	alert('success');                               
                    window.location.reload();
                }
            }  
		});
		}
	});
});

