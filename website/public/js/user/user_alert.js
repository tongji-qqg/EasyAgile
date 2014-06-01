
$(function(){
	var alerts;
	var pages;
	function loadAlertsAjax(){
		$.ajax({
			type: 'GET',
			url: '/API/aa',
			dataType: 'json',			
			success: function(data) {
				if (data.state === 'error')
					alert('error! ' + data.message);
				if (data.state === 'success') {
					alerts = data.alert.reverse();
					pages = Math.floor(alerts.length / 7);
					if(alerts.legth % 7 != 0) pages++;
					var ul = $('#user_alerts_pages');
					ul.empty();
					 var options = {
				            currentPage: 1,
				            totalPages: pages,
				            bootstrapMajorVersion: 3,
				            onPageChanged: function(e,oldPage,newPage){
				                //console.log("Current page changed, old: "+oldPage+" new: "+newPage);
				                buildAlert(newPage);
				            }
				        }
					ul.bootstrapPaginator(options);	
					buildAlert(1);
				}
			}
		});
	}
	function buildAlert(p){
		if(!alerts) return;
		if(p > pages) return;
		p = (p-1)*7
		$('#alerts-div').empty();		
		for(var i=p;i<alerts.length && i< p+7;i++){
			$('#alerts-div').append(buildOneAlert(alerts[i]));
		}
	}
	function buildOneAlert(alert){
		var alertHtml = '<div class="message">'
                            +'<h6 class="alert-date" style="color:#CCC;">2014年5月15日</h6>'
                            +'<div class="well" style="color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6; ">'
                                +'<div class="messageContent" style="width:93%;display:inline-block;">'
	                                +'<p class="alert-message">'                                
	                                +'</p>'
                                +'</div>'
                                +'<button class="deleteButton fa fa-trash-o"  style="margin-top:-10px;float:right;background-color:transparent;border:none;"></button>'
                            +'</div>'
                        +'</div>';
        function formateDate (date){
        	date = new Date(date);
        	return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日 '+ date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        }
        function readAlert(aid){
        	console.log(aid);
        	$.ajax({
					type: 'PUT',
					url: '/API/a/'+aid,
					dataType: 'json',			
					success: function(data) {
						if (data.state === 'error')
							window.alert('error '+data.message);
						if (data.state === 'success') {							
						}
					}
				});	
        }
        
        var div = $(alertHtml);
        $('.alert-date', div).text(formateDate(alert.date));
        if(alert.type == 0){
        	$('.alert-message',div).text(alert.from.name + ' '+ alert.message);
        	var accept = $('<a >',{'class':'btn btn-success btn-sm active','href':alert.data[0]}).text('accept');
        	var reject = $('<a >',{'class':'btn btn-danger btn-sm active', 'href':alert.data[1]}).text('reject');
        	if(!alert.read){
	        	$('.messageContent',div).append(accept);
	        	$('.messageContent',div).append(reject);
	        }
        	accept.click(function(e){            	
        		e.preventDefault();
        		if(!uid) return;
        		//console.log(alert._id);
        		readAlert(alert._id); 
        		$.ajax({
					type: 'GET',
					url: alert.data[0],
					dataType: 'json',			
					success: function(data) {
						if (data.state === 'error')
							window.alert('error '+data.message);
						if (data.state === 'success') {
							window.location.replace('/user/'+uid);							
						}
					}
				});		
        	});
        	reject.click(function(e){            	
        		e.preventDefault();        		
        		if(!uid) return;
        		readAlert(alert._id);
        		$.ajax({
					type: 'GET',
					url: alert.data[1],
					dataType: 'json',			
					success: function(data) {
						if (data.state === 'error')
							window.alert('error '+data.message);
						if (data.state === 'success') {
							$('body').trigger('loadAlertsAjax');
						}
					}
				});		
        	});
        }
        else{
        	$('.alert-message',div).text(alert.from.name + ' '+ alert.message);
        }
        $('.deleteButton', div).click(function(){
        	$.ajax({
					type: 'DELETE',
					url: '/API/a/'+alert._id,
					dataType: 'json',			
					success: function(data) {
						if (data.state === 'error')
							window.alert('error '+data.message);
						if (data.state === 'success') {
							$('body').trigger('loadAlertsAjax');
						}
					}
				});
        })
        return div;
	}
	$('body').on('loadAlertsAjax',loadAlertsAjax)
	$('body').trigger('loadAlertsAjax');
});

$(function(){
	$('#delete-all-alert-button').click(function(){
		$.ajax({
			type: 'DELETE',
			url: '/API/a',
			dataType: 'json',			
			success: function(data) {
				if (data.state === 'error')
					window.alert('error '+data.message);
				if (data.state === 'success') {
					$('body').trigger('loadAlertsAjax');
				}
			}
		});
	})
})