var g_allIssues, g_type;

$(function(){
	var sort_order = true;
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
                    if(!sort_order) g_allIssues = g_allIssues.reverse();
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
			/*var row = $('<div >',{'class':'row', 'style':'margin-left:10px;width:95%;'});
			var portlet = $('<div>',{'class':'portlet-body'}).appendTo(row);
			var tableDiv = $('<div>',{'class':'table-responsive'}).appendTo(portlet);
			var table = $('<table>',{'class':'table'}).appendTo(tableDiv);
			var tableBody = $('<tbody>').appendTo(table);*/
			var tableLine = $('<tr>');

			var tableUnit1 = $('<td>',{'style':'width:10%;'}).appendTo(tableLine);
			$('<img>',{'class':'img-circle','style':'width:50px;height:50px;','src':'/usericons/537861731cdab72904944d9e.jpg'}).appendTo(tableUnit1);
			$('<h6>').text(i.finder.name).appendTo(tableUnit1);

			var tableUnit2= $('<td>',{'style':'width:80%'}).appendTo(tableLine);
			//var div = $('<div >',{'class':'well well-sm', 'style':'background-color:#fcf8e3;border-color:#faebcc;color:#000;border-radius:10px;'}).appendTo(row);
			//$('<h6 >',{'style':'color:#CCC;'}).text(y+'年'+m+'月'+d+'日'+i.finder.name).appendTo(div);
			//var checkBoxDiv = $('<div >', {'class':'checkbox'}).appendTo(div);

			$('<h6 >',{'style':'color:#CCC;'}).text(y+'年'+m+'月'+d+'日').appendTo(tableUnit2);
			//var checkBoxDiv = $('<div >', {'class':'checkbox'}).appendTo(tableUnit2);
			//var label = $('<label >').appendTo(checkBoxDiv);
			//label.text(i.description);
			tableUnit2.append(i.description);

            var tableUnit3 = $('<td>',{'style':'width:10%'}).appendTo(tableLine);          
			$('<input >',{'type':'checkbox','class':'issue','iid':i._id,'style':'margin-top:35px;border-style:inset;'}).appendTo(tableUnit3);
						
			return tableLine;
		}	
		
			
		//$('#allIssueDiv').empty();
		$('#tableBody').empty();
		g_allIssues.forEach(function(i){
			if(i.solved == g_type)
				//$('#allIssueDiv').append(buildIssueRow(i));
				$('#tableBody').append(buildIssueRow(i));			
		})
	}
	$('body').on('loadIssue', loadIssue);
	g_type = false;
	$('body').trigger('loadIssue');

	$('#sort-a').click(function(){
		sort_order = false;
		$('body').trigger('loadIssue');
	})
	$('#sort-d').click(function(){
		sort_order = true;
		$('body').trigger('loadIssue');
	})
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
		$('#openIssue').attr('style',"background-color:#fcf8e3;");
		$('#openIssue').attr('style',"border-color:#faebcc;");
		$('#closeIssue').attr('style',"background-color:white;");
		$('#closeIssue').attr('style',"border-color:#adadad;");
		$('body').trigger('loadIssue');
	}
	function closeClick(){
		g_type = true;
		$('#closeIssueButton').prop("disabled", true);
		$('#closeIssue').attr('style',"background-color:#fcf8e3;");
		$('#closeIssue').attr('style',"border-color:#faebcc;");
		$('#openIssue').attr('style',"background-color:white;");
		$('#openIssue').attr('style',"border-color:#adadad;");
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