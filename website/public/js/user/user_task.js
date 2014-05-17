var uid;

$(function() {
    uid = uid || window.location.href.split('/')[4];        

    //loadTasks();    
});
/*
function loadTasks(){
	if(!uid) return;
	 $.ajax({
            type: 'GET',
            url: '/API/u/tc',
            dataType: 'json',            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {    
                    alert('success!');                    
                }
            }            
        });
}
*/