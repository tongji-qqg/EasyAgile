var g_allIssues, g_type;

$(function(){
	
	function loadIssue(){
		if(!projectid)return;
		$.ajax({
            type: 'GET',
            url: '/API/p/'+projectid+'/i',
            dataType: 'json',
          	
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {        
                    g_allIssues = data.issues;                    
                    buildIssueBlock();
                }
            }            
        });
	}
	function buildIssueBlock(type){
		function buildIssueRow(i){
			var t = new Date(i.discoverTime);
			var y = t.getFullYear();
			var m = t.getMonth()+1;
			var d = t.getDate();
			var row = $('<div >',{'class':'row', 'style':'margin-left:10px;width:95%;'})
			var div = $('<div >',{'class':'well well-sm', 'style':'background-color:#d9edf7;border-color:#bce8f1;color:#31708f;border-radius:10px;'}).appendTo(row);
			$('<h6 >',{'style':'color:#CCC;'}).text(y+'年'+m+'月'+d+'日'+i.finder.name).appendTo(div);
			var checkBoxDiv = $('<div >', {'class':'checkbox'}).appendTo(div);
			var label = $('<label >').appendTo(checkBoxDiv);
			label.text(i.description);
			var check = $('<input >',{'type':'checkbox','class':'issue','iid':i._id}).appendTo(label);			
			return row;
		}	
		
			
		$('#allIssueDiv').empty();
		g_allIssues.forEach(function(i){
			if(i.solved == g_type)
				$('#allIssueDiv').append(buildIssueRow(i));
		})
	}
	$('body').on('loadIssue', loadIssue);
	g_type = false;
	$('body').trigger('loadIssue');
});

$(function(){
	function postIssue(des){
		if(!projectid)return;
        $.ajax({
            type: 'POST',
            url: '/API/p/'+projectid+'/i',
            dataType: 'json',
          	data:{
          		description: des          		
          	},
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {        
                    $('body').trigger('loadIssue');
                }
            }            
        });
    
	}
	$('#postIssueButton').click(function(){
		var input = $('#issueDescription').val();
		if(!input) return;
		if(input.trim() == '') return;
		postIssue(input);
		$('#issueDescription').val('');
	})
})
$(function(){
	function openClick(){
		g_type = false;
		$('#closeIssueButton').prop("disabled", false);
		$('#openIssue').attr('style',"background-color:#d9edf7;");
		$('#closeIssue').attr('style',"background-color:white;");
		$('body').trigger('loadIssue');
	}
	function closeClick(){
		g_type = true;
		$('#closeIssueButton').prop("disabled", true);
		$('#closeIssue').attr('style',"background-color:#d9edf7;");
		$('#openIssue').attr('style',"background-color:white;");
		$('body').trigger('loadIssue');
	}
	$('#openIssue').click(openClick);
	$('#closeIssue').click(closeClick);
});

$(function(){
	function closeIssue(iid){
		if(!projectid) return;
		$.ajax({
            type: 'PUT',
            url: '/API/p/'+projectid+'/i/'+iid,
            dataType: 'json',
          	data:{
          		solved:true	
          	},
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {        

                    $('body').trigger('loadIssue');
                }
            }            
        });
	}
	$('#closeIssueButton').click(function(){
		$('.issue').each(function(i,checkbox){
			//alert($(checkbox).attr('iid'))
			var iid = $(checkbox).attr('iid');			
			if($(checkbox).is(':checked'))
				closeIssue(iid);
		})
		//$('body').trigger('loadIssue');
	})
})