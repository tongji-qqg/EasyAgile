$(function(){
	var editors;
	loadProjectEditor();

	var recognizeExtensions = ['c','cpp','java','csharp','css','js','html','xml','sql','sh'];
	var recognizeMode = ['text/x-csrc','text/x-c++src','text/x-java','text/x-csharp','text/css',
	                     'text/javascript','text/html','application/xml','text/x-sql','text/x-sh'];
	function loadProjectEditor(){
		if(!projectid)return;
		$.ajax({
	        type: 'GET',
	        url: '/API/p/'+projectid+'/e',
	        dataType: 'json',        
	        success: function(data){

	            if(data.state === 'error')
	                alert('error! '+ data.message);
	            if(data.state === 'success')
	            {                                  
	               editors = data.editor;
	               buildElements();
	               JQD.go();	               
	            }
	        }            
	    });
	}
	function buildNewDoc(){
		/////////////////////////////////////////////// desktop icon
		var icon = $('<a >',{
			'class':'abs icon', 
			'style':'left:20px;top:20px',
			'href' :'#icon_dock_new'
		}).appendTo(desktop);
		
		$('<img >',{'src':'/plugins/jQuery-Desktop/assets/images/icons/new/add_64.png'})			
			.appendTo(icon);
		icon.append('新建文档');
		
		//////////////////////////////////////////////// desktop div
		var win = $('<div >',{'id':'window_new','class':'abs window','style':'height:300px;width:550px'}).appendTo(desktop);
		var innerWin = $('<div >',{'class':'abs window_inner'}).appendTo(win);
		var top = $('<div >',{'class':'window_top'}).appendTo(innerWin);
		var span_top_left = $('<span >',{'class':'float_left'}).appendTo(top);
		$('<img >',{'src':'/plugins/jQuery-Desktop/assets/images/icons/new/add_16.png'})				
			.appendTo(span_top_left);		
		span_top_left.append('新建文档');
		var span_top_right = $('<span >',{'class':'float_right'}).appendTo(top);
		$('<a >',{'class':'window_min','href':'#'}).appendTo(span_top_right);
		$('<a >',{'class':'window_resize','href':'#'}).appendTo(span_top_right);
		var closeBtn = $('<a >',{'class':'window_close','href':'#icon_dock_new'}).appendTo(span_top_right);
		////////
		var content = $('<div >',{'class':'abs window_content'}).appendTo(innerWin);		
		var winMain = $('<div >',{'class':'window_main'}).appendTo(content);
		var form = $('<form >',{'class':'form-inline','style':'margin-top:100px'}).appendTo(winMain);
		var div = $('<div >',{'class':'form-group'}).appendTo(form);		
		$('<input >',{'name':'fileName','class':'form-control','id':'newFileNameInput','placeholder':'filename'}).appendTo(div);
		var newButton = $('<button >',{'id':'newFileButton'}).text('new').appendTo(div)
		newButton.click(function(e){
			e.preventDefault();
			var input = $('#newFileNameInput').val();			
			if(input.trim().length > 0) {
				$.ajax({
			        type: 'POST',
			        url: '/API/p/'+projectid+'/e',
			        dataType: 'json',        
			        data:{
			        	name:input
			        },
			        success: function(data){

			            if(data.state === 'error')
			                alert('error! '+ data.message);
			            if(data.state === 'success')
			            {  
			               $('#newFileNameInput').val(''); 
			               closeBtn.click();                                 
			               loadProjectEditor(); 			               
			            }
			        }            
			    });
			}//end if
			
		})//end click
		////////
		$('<div >',{'class':'abs window_bottom'}).appendTo(innerWin);		
		/////////////////////////////////////////////////// dock icon
		var li = $('<li >',{'id':'icon_dock_new'}).appendTo(dock);
		var lia = $('<a >',{'href':'#window_new'})
		.text('新建文档')
		.appendTo(li);
	}
	function buildDeleteDoc(){
		/////////////////////////////////////////////// desktop icon
		var icon = $('<a >',{
			'class':'abs icon', 
			'style':'left:20px;top:120px',
			'href' :'#icon_dock_delete'
		}).appendTo(desktop);
		
		$('<img >',{'src':'/plugins/jQuery-Desktop/assets/images/icons/new/delete_64.png'})			
			.appendTo(icon);
		icon.append('删除文档');
		
		//////////////////////////////////////////////// desktop div
		var win = $('<div >',{'id':'window_delete','class':'abs window','style':'height:300px;width:550px'}).appendTo(desktop);
		var innerWin = $('<div >',{'class':'abs window_inner'}).appendTo(win);
		var top = $('<div >',{'class':'window_top'}).appendTo(innerWin);
		var span_top_left = $('<span >',{'class':'float_left'}).appendTo(top);
		$('<img >',{'src':'/plugins/jQuery-Desktop/assets/images/icons/new/delete_16.png'})				
			.appendTo(span_top_left);		
		span_top_left.append('删除文档');
		var span_top_right = $('<span >',{'class':'float_right'}).appendTo(top);
		$('<a >',{'class':'window_min','href':'#'}).appendTo(span_top_right);
		$('<a >',{'class':'window_resize','href':'#'}).appendTo(span_top_right);
		var closeBtn = $('<a >',{'class':'window_close','href':'#icon_dock_delete'}).appendTo(span_top_right);
		////////
		var content = $('<div >',{'class':'abs window_content'}).appendTo(innerWin);		
		var winMain = $('<div >',{'class':'window_main'}).appendTo(content);
		var form = $('<form >',{'class':'form-inline','style':'margin-top:100px'}).appendTo(winMain);
		var div = $('<div >',{'class':'form-group'}).appendTo(form);		
		var select = $('<select >',{'id':'deleteFileNameInput'}).appendTo(div);
		editors.forEach(function(e){
			$('<option >',{'value':e._id}).text(e.name).appendTo(select);
		})
		var deleteButton = $('<button >',{'id':'newFileButton'}).text('delete').appendTo(div)
		deleteButton.click(function(e){
			e.preventDefault();
			var input = $('#deleteFileNameInput').val();
			//alert(input);				
			if(input && input.length == 24) {				
				$.ajax({
			        type: 'DELETE',
			        url: '/API/p/'+projectid+'/e/'+input,
			        dataType: 'json',        			        
			        success: function(data){

			            if(data.state === 'error')
			                alert('error! '+ data.message);
			            if(data.state === 'success')
			            {  
			               $('#deleteFileNameInput').val(''); 
			               closeBtn.click();                                 
			               loadProjectEditor(); 			               
			            }
			        }            
			    });
			}//end if
			
		})//end click
		////////
		$('<div >',{'class':'abs window_bottom'}).appendTo(innerWin);		
		/////////////////////////////////////////////////// dock icon
		var li = $('<li >',{'id':'icon_dock_delete'}).appendTo(dock);
		var lia = $('<a >',{'href':'#window_delete'})
		.text('删除文档')
		.appendTo(li);
	}
	function buildElements(){
		var dock = $('#dock');
		var desktop = $('#desktop');
		dock.empty();
		desktop.empty();
		var pox_x = 20, pox_y = 220;
		buildNewDoc();
		buildDeleteDoc();
		editors.forEach(function(e){
			/////////////////////////////////////////////// desktop icon
			var icon = $('<a >',{
				'class':'abs icon', 
				'style':'left:'+pox_x+'px;top:'+pox_y+'px',
				'href' :'#icon_dock_'+e._id
			}).appendTo(desktop);
			pox_y += 100;
			if((pox_y + 150)> $(window).height()){
				pox_y = 20;
				pox_x += 100;
			}
			if(pox_x > $(window).width())
				return;
			var ext = getFileExtension(e.name);
			if( ext === '')
				$('<img >',{'src':'/plugins/jQuery-Desktop/assets/images/icons/new/doc_64.png'})			
				.appendTo(icon);
			else
				$('<img >',{'src':('/plugins/jQuery-Desktop/assets/images/icons/new/'+ext+'_64.png')})			
				.appendTo(icon);
			icon.append(e.name);
			//////////////////////////////////////////////// desktop div
			var win = $('<div >',{'id':'window_'+e._id,'class':'abs window'}).appendTo(desktop);
			var innerWin = $('<div >',{'class':'abs window_inner'}).appendTo(win);
			var top = $('<div >',{'class':'window_top'}).appendTo(innerWin);
			var span_top_left = $('<span >',{'class':'float_left'}).appendTo(top);
			$('<img >',{'src':'/plugins/jQuery-Desktop/assets/images/icons/new/edit_16.png'})				
				.appendTo(span_top_left);		
			span_top_left.append(e.name)
			var span_top_right = $('<span >',{'class':'float_right'}).appendTo(top);
			$('<a >',{'class':'window_min','href':'#'}).appendTo(span_top_right);
			$('<a >',{'class':'window_resize','href':'#'}).appendTo(span_top_right);
			var close = $('<a >',{'class':'window_close','href':'#icon_dock_'+e._id}).appendTo(span_top_right);
			////////
			var content = $('<div >',{'class':'abs window_content firepad-container'}).appendTo(innerWin);
			$('<div >',{'style':'float:left','id':'userlist_'+e._id}).appendTo(content);
			$('<div >',{'class':'','style':'margin-left: 165px;','id':'firepad_'+e._id}).appendTo(content);
			////////
			$('<div >',{'class':'abs window_bottom'}).appendTo(innerWin);
			$('<span >',{'class':'abs ui-resizable-handle ui-resizable-se'}).appendTo(win);
			/////////////////////////////////////////////////// dock icon
			var li = $('<li >',{'id':'icon_dock_'+e._id}).appendTo(dock);
			var lia = $('<a >',{'href':'#window_'+e._id})
			.text(e.name)
			.appendTo(li);
			/////////////////////////////////////////////////// firepad
			
			var firepad ;			
			var codeMirror;
			var firepadUserList;
			icon.click(function(){
				if(firepad) return;
				var firepadRef = new Firebase(e.path);
				var mode = getFileModeByExtension(e.name) ; 
				if(mode === ''){
					codeMirror = CodeMirror(document.getElementById('firepad_'+e._id), { 
						lineWrapping: true,
						mode:''
					});
					firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
		        	{ richTextToolbar: true, richTextShortcuts: true, userId: uid });
		        	
				}
				else{				
					codeMirror = CodeMirror(document.getElementById('firepad_'+e._id), {
	      				lineNumbers: true,
	      				mode: mode
	    			});
					firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,{userId: uid});
					
				}
	        	
		        firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
		        document.getElementById('userlist_'+e._id), uid, userName);	        	
			});
			close.click(function(){
				if(firepad) {					
					firepad.dispose();
					firepadUserList.dispose();
					content.empty();
					$('<div >',{'style':'float:left','id':'userlist_'+e._id}).appendTo(content);
					$('<div >',{'class':'','style':'margin-left: 165px;','id':'firepad_'+e._id}).appendTo(content);					
					firepad = null;
				}
			});			
		});
	}
	function getFileModeByExtension(file){
		var arrfn = file.split(".");  
		if(arrfn.length > 1){
			var ext = arrfn[arrfn.length - 1];
			for(var i=0;i<recognizeExtensions.length;i++)
				if(recognizeExtensions[i] === ext)
					return recognizeMode[i];
			return '';
		}    		
    	else 
    		return '';
	}
	function getFileExtension(file){
		var arrfn = file.split(".");  
		if(arrfn.length > 1){
			var ext = arrfn[arrfn.length - 1];
			for(var i=0;i<recognizeExtensions.length;i++)
				if(recognizeExtensions[i] === ext)
					return ext;
			return '';
		}    		
    	else 
    		return '';
	}
});

$(function(){
	//$('body').css('background-image','url("'+'/img/canvas_bg.jpg'+'")');
	$('body').css('background-color','#fff');




})