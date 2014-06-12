$(function(){
    function deleteTopic(tid){
        $.ajax({  
            type: 'DELETE',
            url: '/API/p/'+projectid+'/t/'+tid,
            dataType: 'json',
            
            success: function(data){

                if(data.state === 'error')
                    bootbox.alert(data.message);
                if(data.state === 'success')
                {                                  
                    bootbox.alert('success!')
                    window.location.replace('/project_topic/'+projectid);                          
                }
            }            
        });   
    }
    $('.deleteTopic').click(function(){
        var tid = $(this).attr('tid');
        //alert(tid);
        deleteTopic(tid);
    })
})