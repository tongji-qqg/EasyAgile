var pid, sid;

var taskBoard = taskBoard || {};

$(function() {
    pid =  window.location.href.split('/')[4];
    
    sid = window.location.href.split('/')[6];

    loadProjectInfo(function(data){

	    if(data.state === 'error')
	        alert('error! '+ data.message);
	    if(data.state === 'success')
	    {        
	        var p = data.project;                          
	        $('#project-side-nav-name').text(data.project.name);   
	        $('#project-des-title').html('<h1>'+p.name+'<small>created by '+p.owner.name+' in '+new Date(p.createTime).Format('yyyy-M-d')+'</small> </h1>');                                     
	        $('#project-side-nav-sprint').attr('href','/project_sprint/'+p._id);
                    $('#project-side-nav-taskboard').attr('href','/project_taskboard/'+p._id+'/sprint/'+p.cSprint);
	    }
	});    
    
    loadTasks(function(data){

	    if(data.state === 'error')
	        alert('error! '+ data.message);
	    if(data.state === 'success')
	    {    
	    	todo.clear();
	    	data.tasks.forEach(function(t){
	    		todo.addAPI(t);	    		
	    	});
	    }
	});

	loadProjectInfo();
});




var loadTasks = function(callback){
		if(pid && sid){
			$.ajax({
	            type: 'GET',
	            url: '/API/p/'+pid+'/s/'+sid+'/tasks',
	            dataType: 'json',
	            
	            xhrFields: {
	                withCredentials: true
	            },
	            success: callback            
	        });
		}
	};

var loadProjectInfo = function(callback){
  		
  		if(!pid) return ;

        $.ajax({
            type: 'GET',
            url: '/API/p/'+pid,
            dataType: 'json',
            
            xhrFields: {
                withCredentials: true
            },
            success: callback
        });	
	};       

var createTask = function(task,callback){
	if(!pid || !sid) return;
	var y = task.date.split('/')[2];
	var m = task.date.split('/')[1];
	var d = task.date.split('/')[0];

	$.ajax({
            type: 'POST',
            url: '/API/p/'+pid+'/s/'+sid+'/tasks',
            dataType: 'json',
            data:{
            	title: task.title,
            	description: task.description,
            	deadline: new Date(y,m-1,d),
            	level: 1            	
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
            	if(!data.state || data.state === 'error'){            		
            		alert('error! '+ data.message);
            	}			        
			    if(data.state === 'success')
			    {        
			    	alert('success');
					todo.addAPI(data.task);
			    }
            }
        });	
}

var deleteTask = function(task,callback){
	if(!pid || !sid) return;

	$.ajax({
            type: 'DELETE',
            url: '/API/p/'+pid+'/s/'+sid+'/t/'+task.id,
            dataType: 'json',
            
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
            	if(!data.state || data.state === 'error'){            		
            		alert('error! '+ data.message);
            	}			        
			    if(data.state === 'success')
			    {        
			    	alert('success');					
			    }
            }
        });	
}

var modifyTask = function(task){
	if(!pid || !sid) return;

	$.ajax({
            type: 'PUT',
            url: '/API/p/'+pid+'/s/'+sid+'/t/'+task.id,
            dataType: 'json',
            
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
            	if(!data.state || data.state === 'error'){            		
            		alert('error! '+ data.message);
            	}			        
			    if(data.state === 'success')
			    {        
			    	alert('success');					
			    }
            }
        });		
}