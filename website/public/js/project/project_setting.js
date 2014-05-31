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
//////////////////////////////////////////////////////////////////////////////////////////////
$(function(){
	function showPage(page){
		function formatDate(date){
			var date = new Date(date);
			return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+ date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
		}
		function buildTR(history){
			var tr = $('<tr >');
			var what = history.who.name;
			console.log(history);
			switch(history.type){
				case 0: what = what + ' 创建了项目 ' + history.what[0] + ' 项目描述 '+ history.what[1]; break;
				case 1: what = what + ' 修改项目信息 '+history.what[0] + ' 项目描述 '+ history.what[1]; break;
				case 2: what = what + ' 邀请用户 '   + history.toUser.name + '加入项目'; break;
				case 3: what = what + ' 邀请用户 '   + history.what[0] +  '加入项目'; break;
				case 4: what = what + ' 接受邀请加入项目'; break;
				case 5: what = what + ' 把 '+ history.toUser.name + ' 移出项目 '; break;
				case 6: what = what + ' 离开了项目'; break;
				case 7: what = what + ' 把 '+ history.toUser.name + ' 设为管理员 '; break;
				case 8: what = what + ' 把 '+ history.toUser.name + ' 设为一般成员 '; break;
				case 9: what = what + ' 把 '+ history.toUser.name + ' 分组设为 '+ (history.what[0]? history.what[0]:'未分组'); break;
				case 10:what = what + ' 创建新的分组 '+ history.what[0]; break;
				case 11:what = what + ' 删除分组 '+ history.what[0]; break;
				case 12:what = what + ' 创建在线文档 '+history.what[0]; break;
				case 13:what = what + ' 删除在线文档 '+history.what[0]; break;
				case 14:what = what + ' 打开 issue '+history.what[0];  break;
				case 15:what = what + ' 关闭 issue '+history.what[0]; break;
				case 16:what = what + ' 删除 issue '+history.what[0]; break;
				case 17:what = what + ' 上传文件 '+history.what[0]; break;
				case 18:what = what + ' 下载文件 '+history.what[0]; break;
				case 19:what = what + ' 删除文件 '+history.what[0]; break;
				case 20:what = what + ' 创建新Sprint '+history.what[0] + ' 描述 '+history.what[1]; break;
				case 21:what = what + ' 删除Sprint '+history.what[0] + ' 描述 '+history.what[1]; break;
				case 22:what = what + ' 设置Sprint '+history.what[0] + ' 为当前Sprint'; break;
				case 23:what = what + ' 发起新话题 '+history.what[0]; break;
				case 24:what = what + ' 删除话题' + history.what[0]; break;
				case 25:what = what + ' 把项目归档' + history.what[0]; break;
				case 26:what = what + ' 删除项目'; break;
				case 27:what = what + ' 重新启动了项目 '+histroy.what[0]; break;
			}
			tr.append($('<td >').text(what));
			tr.append($('<td >').text(formatDate(history.when)));
			return tr;
		}
		console.log(page);
		var start = (page-1) * 5;
		var end   = start + 5;
		if(page<1 || page >pages) return;
		$('#history-table').empty();
		$.ajax({
            type: 'GET',
            url: '/API/p/'+projectid+'/h/'+start+'/'+end,
            dataType: 'json',            
            success: function(data){
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success') {
                	for(var i=0;i<data.historys.length;i++){
                		$('#history-table').append(buildTR(data.historys[i]));
                	}
                }
            }            
        });
	}
	var pages = Math.floor(historyLength / 5);
	if(historyLength % 5 != 0) pages++;
	var ul = $('#project_history_pages');
	ul.empty();
	 var options = {
            currentPage: 1,
            totalPages: pages,
            bootstrapMajorVersion: 3,
            onPageChanged: function(e,oldPage,newPage){
                //console.log("Current page changed, old: "+oldPage+" new: "+newPage);
                showPage(newPage);
            }
        }
	ul.bootstrapPaginator(options);	
	showPage(1);
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
