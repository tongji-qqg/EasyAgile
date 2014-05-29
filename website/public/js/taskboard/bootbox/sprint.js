var sprintBootBox = (function() {

	function initSprintDate(modal, duration) {

		var containerStart = jQuery(".dateStart", modal);
		var containerEnd = jQuery(".dateEnd", modal);
		var inputStart = containerStart.find("input");
		var inputEnd = containerEnd.find("input");
		var valueStart = null;
		var valueEnd = null;

		if (duration) {
			inputStart.val(duration.start);
			inputEnd.val(duration.end);
		}

		containerStart.bootstrapDP({
			format: "yyyy-mm-dd",
			weekStart: 1,
			calendarWeeks: true
		})
			.on("show", function(event) { // Fix z-index of datepicker
				//jQuery(".datepicker").css("z-index", parseInt(jQuery(this).closest(".modal").css("z-index"), 10) + 1);
			})
			.on("changeDate", function(event) {});

		containerEnd.bootstrapDP({
			format: "yyyy-mm-dd",
			weekStart: 1,
			calendarWeeks: true
		})
			.on("show", function(event) { // Fix z-index of datepicker
				//jQuery(".datepicker").css("z-index", parseInt(jQuery(this).closest(".modal").css("z-index"), 10) + 1);
			})
			.on("changeDate", function(event) {});
	}

	function addSprintAjax() {
		if (!pid || pid == 0) return;

		$.ajax({
			type: 'POST',
			url: '/API/p/' + pid + '/s',
			dataType: 'json',
			data: {
				name: $('#formSprintNewTitle').val(),
				description: $('#formSprintNewDescription').val(),
				startTime: new Date($('#formSprintNewDateStart').val()),
				endTime: new Date($('#formSprintNewDateEnd').val()),
			},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {

					$('body').trigger("loadProject");
				}
			}
		});
	}

	function editSPrintAjax() {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		$.ajax({
			type: 'PUT',
			url: '/API/p/' + pid + '/s/' + sid,
			dataType: 'json',
			data: {
				name: $('#formSprintNewTitle').val(),
				description: $('#formSprintNewDescription').val(),
				startTime: new Date($('#formSprintNewDateStart').val()),
				endTime: new Date($('#formSprintNewDateEnd').val()),
			},
			success: function(data) {
				//console.log(data.message);
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {

					$('body').trigger("loadProject");
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function buildAdd() {
		var buttons = [{
			label: "新建Sprint",
			className: "btn-primary pull-right",
			callback: function() {
				addSprintAjax();
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog('创建Sprint', addHtml, buttons);

		modal.on("shown.bs.modal", function() {

		});
		initSprintDate(modal, null);
		return modal;
	}

	function buildEdit() {
		var buttons = [{
			label: "保存",
			className: "btn-primary pull-right",
			callback: function() {
				editSPrintAjax();
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog('编辑Sprint &lt;' + g_sprint.name + '&gt;', addHtml, buttons);
		modal.on("shown.bs.modal", function() {
			$('#formSprintNewTitle').val(g_sprint.name);
			$('#formSprintNewDescription').val(g_sprint.description);
		});
		initSprintDate(modal, {
			start: g_sprint.startTime,
			end: g_sprint.endTime
		});
		return modal;
	}

	function buildHistory() {
console.log('sprint history');
		var buttons = [{
			label: "确认",
			className: "btn-primary pull-right",
			callback: function() {
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog('Sprint历史 &lt;' + g_sprint.name + '&gt;', historyHtml, buttons);
		modal.on("shown.bs.modal", function() {
			$.ajax({
                type: 'GET',
                url: '/API/p/' + pid + '/s/' + sid + '/h',
                dataType: 'json',                
                success: function(data) {
                    if (data.state === 'error')
                        bootbox.alert('error! ' + data.message);
                    if (data.state === 'success') {
                    	console.log('sprint history');
                        for(var i=0;i<data.historys.length;i++){
                        	$('#sprintHistoryDiv').append(buildHistoryP(data.historys[i]));
                        }
                    }
                }
            });//end ajax  
		});		
		return modal;
	}
	function buildHistoryP(history){
		function formatDate(date){
			return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		}
		var what = formatDate(new Date(history.when)) + ' ';
		switch(history.type){
			case 0: what += history.who.name + ' 创建了Sprint: ' + history.what[0] 
			                                + ', Sprint描述: ' + history.what[1];
					if(history.what[2]){
						what += ', 开始时间: ' + formatDate(new Date(history.what[2]));
					}
					if(history.what[3]){
						', 截至日期: ' + formatDate(new Date(history.what[3]))
					}
					break;
			case 1: what += history.who.name + ' 设置Sprint为: ' + history.what[0] 
			                                + ', Sprint描述: ' + history.what[1];
					if(history.what[2]){
						what += ', 开始时间: ' + formatDate(new Date(history.what[2]));
					}
					if(history.what[3]){
						', 截至日期: ' + formatDate(new Date(history.what[3]))
					}
					break;
			case 2: what += history.who.name + ' 创建Backlog: ' + history.what[0] + ', Backlog描述 ' + history.what[1];
			        break;
			case 3: what += history.who.name + ' 删除Backlog: ' + history.what[0] + ', Backlog描述 ' + history.what[1];
			        break;
			case 4: what += history.who.name + ' 修改Backlog: '+ history.what[0] + ', Backlog描述 ' + history.what[1];
			 		break;
			case 5: what += history.who.name + ' 创建任务: '+ history.what[0]; break;
			case 6: what += history.who.name + ' 删除任务: '+ history.what[0]; break;
		}
		return $('<p >').html(what);		
	}
	var addHtml =
		'<form id="formSprintNew" class="form-horizontal">'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewTitle">名称</label>' + '<div class="col-lg-9">' + '<input id="formSprintNewTitle" name="title" type="text" placeholder="Sprint名称" class="form-control" required="required" />' + '</div>' + '</div>'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewDateStart">持续时间</label>' + '<label class="col-lg-3 control-label" for="formSprintNewDateEnd" style="display: none;"></label>' + '<div class="col-lg-9">' + '<div class="input-group date dateStart">' + '<input id="formSprintNewDateStart" name="dateStart" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="start"' + 'data-pair="formSprintNewDateEnd"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '<span class="separator">&mdash;</span>' + '<div class="input-group date dateEnd">' + '<input id="formSprintNewDateEnd" name="dateEnd" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="end"' + 'data-pair="formSprintNewDateStart"' + 'data-focus="false"' + 'data-type="sprint"' + '/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formSprintNewDescription">描述</label>' + '<div class="col-lg-9">' + '<textarea id="formSprintNewDescription" name="description" class="form-control" data-wysiwyg="true" placeholder="添加Sprint描述"></textarea>' + '</div>' + '</div>' + '</form>';

	var historyHtml = '<div id="sprintHistoryDiv"> </div>';
	return {
		addBox: buildAdd,
		editBox: buildEdit,
		historyBox: buildHistory
	}
})();