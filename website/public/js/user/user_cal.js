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
            url: '/API/u/tc',
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

/*

{
				        header: {
				            left: 'prev,next today',
				            center: 'title',
				            right: 'month,agendaWeek,agendaDay'
				        },
				        
				        
				        events: [{
				            title: 'All Day Event',
				            start: new Date(y, m, 1),
				            className: 'fc-green'
				        }, {
				            title: 'Long Event',
				            start: new Date(y, m, d - 5),
				            end: new Date(y, m, d - 2),
				            className: 'fc-orange'
				        }, {
				            id: 999,
				            title: 'Repeating Event',
				            start: new Date(y, m, d - 3, 16, 0),
				            allDay: false,
				            className: 'fc-blue'
				        }, {
				            id: 999,
				            title: 'Repeating Event',
				            start: new Date(y, m, d + 4, 16, 0),
				            allDay: false,
				            className: 'fc-red'
				        }, {
				            title: 'Meeting',
				            start: new Date(y, m, d, 10, 30),
				            allDay: false,
				            className: 'fc-purple'
				        }, {
				            title: 'Lunch',
				            start: new Date(y, m, d, 12, 0),
				            end: new Date(y, m, d, 14, 0),
				            allDay: false,
				            className: 'fc-default'
				        }, {
				            title: 'Birthday Party',
				            start: new Date(y, m, d + 1, 19, 0),
				            end: new Date(y, m, d + 1, 22, 30),
				            allDay: false,
				            className: 'fc-white'
				        }]
*/