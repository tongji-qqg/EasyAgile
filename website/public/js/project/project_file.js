

$(function () {
	//文件上传地址
    var url = '/API/p/'+projectid+'/f';
    var fileCount = 0, fails = 0, successes = 0;
    //初始化，主要是设置上传参数，以及事件处理方法(回调函数)
    $('#projectfileupload').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        stop: function (e, data) {//设置文件上传完毕事件的回调函数
        	alert('success');
            window.location.reload();
        },
        progressall: function (e, data) {//设置上传进度事件的回调函数
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        }
    }).bind('fileuploaddone', function(e, data) {
		  fileCount++;
		  successes++;
		  //console.log('fileuploaddone');
		  if (fileCount === data.files.length) {
		    //console.log('all done, successes: ' + successes + ', fails: ' + fails);
		    // refresh page
		    location.reload();
		  }
		}).bind('fileuploadfail', function(e, data) {
		  fileCount++;
		  fails++;
		  //console.log('fileuploadfail');
		  if (fileCount === data.files.length) {
		    //console.log('all done, successes: ' + successes + ', fails: ' + fails);
		    // refresh page
		    location.reload();
		  }
		});
});

$(function(){
	$('#deleteFileButton').click(function(){

		$("tr.file-tr").each(function(i, tr) {
    		var value = $("input.selectedId", tr).is(':checked');
    		var fid = $(tr).attr('fid');
    		if(value) deleteFile(fid);
		});
		
		window.location.reload();
		function deleteFile(fid){
            alert(fid)
			$.ajax({  ///API/p/:pid/f/:fid'         
            type: 'DELETE',
            url: '/API/p/'+projectid+'/f/'+fid,
            dataType: 'json',
            
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                                  
           			alert('success');        
                }
            }            
        });
		}
	})
})