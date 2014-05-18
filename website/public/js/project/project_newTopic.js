$(function(){


	function postTopic(title, body){
		if(!projectid)return;
		$.ajax({  
            type: 'POST',
            url: '/API/p/'+projectid+'/t',
            dataType: 'json',
            data:{
            	title : title,
            	body: body
            },
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                                  
                	alert('success!')
        			window.location.replace('/project_topic/'+projectid);          			       
                }
            }            
        });
	}
	$('#postTopicButton').click(function(e){
		e.preventDefault();
		var title = $('#newTopicTitleInput').val();
		var body  = $('#newTopicBodyInput').val();		
		postTopic(title, body)
		
	})
})