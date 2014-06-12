$(function(){


	function postTopic(title, body, at){
		if(!projectid)return;
		$.ajax({  
            type: 'POST',
            url: '/API/p/'+projectid+'/t',
            dataType: 'json',
            data:{
            	title : title,
            	body: body,
                at  : at
            },
            success: function(data){

                if(data.state === 'error')
                    bootbox.alert( data.message);
                if(data.state === 'success')
                {                                  
                	//alert('success!')
        			window.location.replace('/project_topic/'+projectid);          			       
                }
            }            
        });
	}
	$('#postTopicButton').click(function(e){
		e.preventDefault();
		var title = $('#newTopicTitleInput').val();
		var body  = $('#summernote').code();
        var at = [];
        //alert(body); 
		//postTopic(title, body)
		$('.atUserCheckbox').each(function(i){            
            if($(this).is(':checked'))
                at.push($(this).attr('uid'));
            //console.log($(this).attr('uid'));
        })
        postTopic(title, body, at);
	})
})

