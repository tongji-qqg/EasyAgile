$(function(){
	function getUserTasks(){
		$.ajax({
			type: 'GET',
			url: '/API/u/tc',
			dataType: 'json',			
			success: function(data) {
				if (data.state === 'error')
					alert('error! ' + data.message);
				if (data.state === 'success') {
					var tasks = data.tasks;
					$('#taskScroll .list-unstyled').empty();
					$('#task_number').text(tasks.length);
					$('#task_drop_down_header').append($('<i >',{'class':'fa fa-tasks'}));
					$('#task_drop_down_header').append(' '+tasks.length+' 个任务');
					tasks.forEach(function(t){
						$('#taskScroll .list-unstyled').append(buildTaskLi(t));
					})
				}
			}
		});
	}
	function buildTaskLi(task){
		var liHtml = '<li>'
                        +'<a href="#">'
                            +'<p class="topnav_task_title">'
 								+'<span class="pull-right">'
                                    +'<strong>60%</strong>'
                                +'</span>'
                            +'</p>'
                            +'<div class="progress progress-striped">'
                                +'<div class="progress-bar " role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"></div>'
                            +'</div>'
                        +'</a>'
                    +'</li>';
        var li = $(liHtml);
        console.log(task.title);
        $('a', li).attr('href','/user_task/'+uid)
        $('.topnav_task_title', li).text(task.title);
        $('<span >',{'class':'pull-right'}).append($('<strong >').text(task.progress+'%')).appendTo($('.topnav_task_title', li));
        $('.progress-bar', li).attr('aria-valuenow', task.progress);
        $('.progress-bar', li).css('width', task.progress+'%');
        if(task.state == 4 || task.state == 2) $('.progress', li).addClass('active');
        var now = new Date();
        if(new Date(task.startTime) > now) $('.progress-bar', li).addClass('progress-bar-success');
        if(new Date(task.deadline) < now) $('.progress-bar', li).addClass('progress-bar-danger');
        return li;
	}
	getUserTasks();
});

$(function(){
	function buildOneAlert(alert){
	
        function formateDate (date){
        	date = new Date(date);
        	return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日 '+ date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        }       
        
        var li = $('<li >');
        var a  = $('<a >',{'href':'/user_message/'+uid}).appendTo(li);
        if(alert.type == 0){
        	var idiv =  $('<div >',{'class':'alert-icon green pull-left'}).appendTo(a);
        	$('<i >',{'class':'fa fa-plus-circle'}).appendTo(idiv);
        }else{
        	var idiv =  $('<div >',{'class':'alert-icon orange pull-left'}).appendTo(a);
        	$('<i >',{'class':'fa fa-download'}).appendTo(idiv);
        }
        a.append(alert.from.name+ ' '+alert.message);
        $('<span >',{'class':'small pull-right'}).append($('<strong >').append($('<strong >').append($('<em >').text(formateDate(alert.date)))));
                
        return li;
	}
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
					$('#alertScroll .list-unstyled').empty();
					var number = 0;
					alerts.forEach(function(a){
						if(a.read)return;
						$('#alertScroll .list-unstyled').append(buildOneAlert(a));
						number++;
					})
					$('#alerts-header').append(number + ' 条新消息');	
					$('#alerts-number').text(number);					
				}
			}
		});
	}
	loadAlertsAjax();
})