var a = 3;

$(function(){
	var left = 50 + '%';
	var top = 15 + '%';

	function initlink(type, newone){	

		return function(e){
			e.preventDefault();
			var id   = $(this).attr('id');
			var winId = 'win'+ id, name = $(this).attr('name');
			$(this).attr('href','#'+winId);
			$(this).unbind('click');
			$(this).click(function(e) {				
	    		e.preventDefault();
	    		$(this.hash).show();	    	
			});
			$(this.hash).addClass('windows-vis');
/*			if(newone){
				var win = $('<div >',{'id':winId,'class':'window finder windows-vis','style':'width:850px;height:450px'});
				var nav = $('<nav >',{'class':'control-window'}).appendTo(win);
				var close = $('<a >',{'href':'#'+winId, 'class':'close', 'data-rel':'close'}).appendTo(nav);
				$('<a >',{'href':'#', 'class':'minimize'}).appendTo(nav);
				$('<a >',{'href':'#', 'class':'deactivate'}).appendTo(nav);
				$('<h1 >',{'class':'titleInside'}).text(name).appendTo(win);
				var container = $('<div >',{'class': 'container'}).appendTo(win);
				$('<div >',{'id':'userlist'+id,'style':'width: 175px;float:left'}).appendTo(container);
				var pad = $('<div >',{'id':'firepad' +id, 'style':'margin-left: 170px;'}).appendTo(container);
				
				close.click(function(e) {
		    		e.preventDefault();
		    		$(this.hash).fadeOut(200, function() {
						$(this).css({ top: top, left: left });
					});
				});
				
				win.draggable({ handle: '.titleInside, .title-mac, .tab', refreshPositions: true, containment: 'window', start: function(event, ui) { $(this).css("z-index", a++); } });
				$('#page').append(win);
			}

*/			
			var firepadRef = new Firebase('https://sizzling-fire-8846.firebaseio.com/firepads/'+id);
			if(type == 'doc'){
				var codeMirror = CodeMirror(document.getElementById('firepad'+id), { lineWrapping: true });
				var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
		        { richTextToolbar: true, richTextShortcuts: true, userId: uid });
		        var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
		        document.getElementById('userlist'+id), uid);
		    }
		    if(type == 'src'){
		    	 var codeMirror = CodeMirror(document.getElementById('firepad'+id), {
      				lineNumbers: true,
      				mode: 'javascript'
    			});
    			//// Create Firepad.
    			var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,{userId: uid});
    			var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
		        document.getElementById('userlist'+id), uid);
		    }
	    }
    }
	$('.doclink').click(initlink('doc'));
	$('.srclink').click(initlink('src'));
/*
	$('#newDocButton').click(function(e){
		if(!pid) return;
		var name = $('#new-file-name-input').val()
		if(!name){
			alert('name can not be null');
			return;
		}
		$.ajax({
            type: 'POST',
            url: '/API/p/'+pid+'/e',
            dataType: 'json',
            data:{
            	name: name,
            	type: 0
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
            	if(data.state == 'error')
            		alert(data.message);
            	else{
            		var file=data.file;
            		var li = $('<li >');
            		var a = $('<a >',{'id':file._id,'name':file.name}).text(file.name).appendTo(li);
            		$('#docFileUL').append(li);
            		$(a).click(initlink('doc', true));
            		$(a).click();
            		
            		$('#newDocLink').click();
            	}
            }
        });	
	});

	$('#newSrcButton').click(function(e){
		if(!pid) return;
		var name = $('#new-src-name-input').val()
		if(!name){
			alert('name can not be null');
			return;
		}
		$.ajax({
            type: 'POST',
            url: '/API/p/'+pid+'/e',
            dataType: 'json',
            data:{
            	name: name,
            	type: 1
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
            	if(data.state == 'error')
            		alert(data.message);
            	else{
            		var file=data.file;
            		var li = $('<li >');
            		var a = $('<a >',{'id':file._id,'name':file.name}).text(file.name).appendTo(li);
            		$('#srcFileUL').append(li);
            		$(a).click(initlink('src', true));
            		$(a).click();
            		
            		$('#newSrcLink').click();
            	}
            }
        });	
	});
*/
})