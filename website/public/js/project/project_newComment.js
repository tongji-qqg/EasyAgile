$(function(){


	function postComment(tid, com){
		if(!projectid)return;
		$.ajax({   //'post   /API/p/:pid/tc/:tid'    
            type: 'POST',
            url: '/API/p/'+projectid+'/tc/'+tid,
            dataType: 'json',
            data:{
            	comment: com
            },
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                                  
                	//alert('success!')
        			window.location.replace('/project_oneTopic/'+projectid+'/t/'+tid);          			       
                }
            }            
        });
	}
	$('#postCommentButton').click(function(e){
		e.preventDefault();
		var tid   = $('#summernote').attr('tid');
		var body  = $('#summernote').code();       
        //alert(body); 
        //alert(tid);
		postComment(tid, body);
		
	})
})

