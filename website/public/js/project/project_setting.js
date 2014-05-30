var g_project;
$(function(){
	function setAdminClick(){
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
	                    $('body').trigger('loadProjectSetting');
	                }
	            }  
	        });
		}
	}
	function unsetAdminClick(){
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
	                    $('body').trigger('loadProjectSetting');
	                }
	            }//end success  
			});
		}
	}
	function deleteMemberClick(){
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
	                    $('body').trigger('loadProjectSetting');
	                }
	            }  
			});
		}
	}
	function buildProjectMemberPanel(){
		var DEFAULT_ICON = '/usericons/default.jpg';
		var panel = $('#projectMemberPanelDiv').empty();
		function owner(){
			var rowDiv = $('<div >',{'class':'row','style':'margin-bottom:10px;'}).appendTo(panel);
			var div = $('<div >',{'class':'col-sm-12'}).appendTo(rowDiv);
			var icon = DEFAULT_ICON;
			if(g_project.owner.icon) icon = '/'+g_project.owner.icon;
			
			$('<img >',{'src':icon,'class':'img-circle','style':'width:40px;height:40px;'}).appendTo(div);
			$('<label >',{'class':'control-label'}).text(g_project.owner.name+'·管理员 '+g_project.owner.email).appendTo(div);	
		}
		owner();
		panel.append($('<hr >'));
		///////////////////////////////////////////////////////////////////////
		g_project.members.forEach(function(member){
			var rowDiv = $('<div >',{'class':'row','style':'margin-bottom:10px;'}).appendTo(panel);
			var leftDiv = $('<div >',{'class':'col-sm-8'}).appendTo(rowDiv);
			var icon = DEFAULT_ICON;
			if(member.ref.icon) icon = '/'+member.ref.icon;
			$('<img >',{'src':icon,'class':'img-circle','style':'width:40px;height:40px;'}).appendTo(leftDiv);
			var name = member.ref.name;
			if(member.isAdmin) name+='·管理员 '+member.ref.email;
			else name +='·普通 '+member.ref.email;
			$('<label >', {'class':'control-label'}).text(name).appendTo(leftDiv);
			//--------------------------------------------------------------//
			var rightDiv = $('<div >',{'class':'col-sm-4'}).appendTo(rowDiv);
			if(member.isAdmin){
				$('<button >',{
					'uid':member.ref._id,
					'type':'button',
					'class':'btn btn-green unset-admin-button'
				}).text('普通成员')
				  .click(unsetAdminClick)
				  .appendTo(rightDiv);
			}
			else{
				$('<button >',{
					'uid':member.ref._id,
					'type':'button',
					'class':'btn btn-green set-admin-button'
				}).text('管理员')
				  .click(setAdminClick)
				  .appendTo(rightDiv);
			}
			$('<button >',{
				'uid':member.ref._id,
				'type':'button',
				'class':'btn btn-red delete-member-button'
			}).text('移除成员')
			  .click(deleteMemberClick)
			  .appendTo(rightDiv);
			panel.append($('<hr >'));
		})
	}
	function loadProjectSetting(){
		if(!projectid)return;
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
	                $('#project-name-input').text(g_project.name);
	                $('#project-description-input').text(g_project.description);
	                buildProjectMemberPanel();
	            }
	        }            
	    });
	}
	
	$('body').on('loadProjectSetting',loadProjectSetting);
	
	$('body').trigger('loadProjectSetting');
})
$(function(){

	$('#project-setting-button').click(function(){
		var name = $('#project-name-input').val().trim();
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
                	alert('success');
                    $('body').trigger('loadProjectSetting');
                }
            }            
        });
	})
})
$(function(){
	$('#add-member-id-button').click(function(){
		var uid = $('#search-member-box').attr('uid');			
		if(uid && uid.length==24){
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
                	$('#search-member-box').val('');                          
                    $('body').trigger('loadProjectSetting');
                }
            }            
        });
		}
	});

	$('#add-member-email-button').click(function(){
		var email = $('#add-member-email-input').val().trim();
		console.log(email);
		if(projectid && projectid.length==24){
			//post /API/p/:pid/mid/:uid
			$.ajax({
            type: 'POST',
            url: '/API/p/'+projectid+'/me/'+email,
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {   
                	alert('success');     
                	$('#add-member-email-input').val('');                          
                    $('body').trigger('loadProjectSetting');
                }
            }            
        });
		}
	});
})
function searchUserInputChange(inputBox){

	function loadUserList(inputName){
		$.ajax({
            type: 'GET',
            url: '/API/u/name/'+inputName,
            dataType: 'json',            
            success: function(data){
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {     
                	var findUserArr = [];                             
                    data.user.forEach(function(u){
                    	if(_.findWhere(g_project.members, {'_id':u._id})) return;
                    	if(g_project.owner._id == u._id) return;
                    	findUserArr.push(u);
                    });                    
					
					if (findUserArr.length > 0) {
						userList.attr('style','');
						findUserArr.forEach(function(u){
							var div = $('<div >').text(u.name)
							    .mouseover(function(){this.style.backgroundColor="#ccc";})
							    .mouseout(function () {this.style.backgroundColor="white";})
							    .click(function () {
							    	inputBox.value = this.innerHTML;
							    	$('#search-member-box').attr('uid', u._id);
							    	$("#userListResult").attr('style','display:none');
							    })
							    .appendTo(userList);
						})						
					} else {
						userList.attr('style','display:none');
					}
                }//end if
            }            
        });
	}
	var userList = $("#userListResult");			
	userList.empty();
	var value = inputBox.value;
	if (value == '') {
		userList.attr('style','');
		return;
	}
	loadUserList(value);
}
///////////////////////////////////////////////////////////////////////////////////////////////
$(function(){
	$('#set-exiting-button').click(function(){
		$.ajax({
            type: 'DELETE',
            url: '/API/p/'+projectid,
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {   
                	alert('success');  
                	window.location.replace('/user/'+uid);              	
                }
            }            
        });
	})
	$('#project-pigeonhole-button').click(function(){
		$.ajax({
            type: 'PUT',
            url: '/API/pf/'+projectid,
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {   
                	alert('success');  
                	window.location.replace('/user/'+uid);              	
                }
            }            
        });
	})
})
/*
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
	                    $('body').trigger('loadProjectSetting');
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
	                    $('body').trigger('loadProjectSetting');
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
                    $('body').trigger('loadProjectSetting');
                }
            }  
		});
		}
	});
});
*/
