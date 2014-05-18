//Calendar Demo
$(function() {


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
   
    /* initialize the calendar
        -----------------------------------------------------------------*/

    $.ajax({
            type: 'GET',
            url: '/API/p/'+projectid+'/s/'+csid+'/t',
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success') {
               
                	var cssName = ['fc-green', 'fc-orange', 'fc-blue','fc-red','fc-purple','fc-default','fc-white'];
                	var option = {
				        header: {
				            left: 'prev,next today',
				            center: 'title',
				            right: 'month,agendaWeek,agendaDay'
				        },				        
				        
				        events :[]
				    };
				    var now = new Date();
				    data.tasks.forEach(function(t){
				    	if(t.state == 1)return;
				    	var opt = {
				    		title: t.title,
				    		start: t.startTime,
				    		end : t.deadline,
				    	};
				    	opt.className = 'fc-blue';
				    	if(new Date(t.deadline) < now)
				    		opt.className = 'fc-red';
				    	if(new Date(t.startTime) > now)
				    		opt.className = 'fc-green';	
				    	
				    		
				    	option.events.push(opt);
				    })
                    $('#calendar').fullCalendar(option);
                          
                }
            }            
    });
    

});