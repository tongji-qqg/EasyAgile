var taskBootBox = (function() {
	function buildMemberOption(id, name) {
		return '<option value="' + id + '">' + name + '</option>';
	}

	function buildSelectedMemberOption(id, name) {
		return '<option value="' + id + '"selected="selected">' + name + '</option>';
	}
	function formatDate(date){
		date = new Date(date);
		return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
	}
	/**
	 * Function initializes sprint add/edit form to use. Note that form is
	 * located in modal content.
	 *
	 * @param   {jQuery|$}  modal           Current modal content
	 * @param   {Boolean}   edit            Are we editing existing sprint or not
	 * @param   {{}}        [parameters]    Custom parameters
	 */
	function initTaskDate(modal, duration) {

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
		var taskStartDate = new Date(g_sprint.startTime);
		taskStartDate.setDate(taskStartDate.getDate()+1);
		var taskEndDate = new Date(g_sprint.endTime);
		taskEndDate.setDate(taskEndDate.getDate()-1);

		containerStart.bootstrapDP({
			format: "yyyy-mm-dd",
			weekStart: 1,
			calendarWeeks: true,
			startDate:formatDate(g_sprint.startTime),
			endDate: formatDate(taskEndDate)
		})
			.on("show", function(event) { // Fix z-index of datepicker
				//jQuery(".datepicker").css("z-index", parseInt(jQuery(this).closest(".modal").css("z-index"), 10) + 1);
			})
			.on("changeDate", function(event) {
				if(!event.date)return;
				startDate = new Date(event.date.valueOf());
				startDate.setDate(startDate.getDate()+1);
				containerEnd.bootstrapDP('setStartDate',startDate);
			});

		containerEnd.bootstrapDP({
			format: "yyyy-mm-dd",
			weekStart: 1,
			calendarWeeks: true,
			startDate:formatDate(taskStartDate),
			endDate: formatDate(g_sprint.endTime)
		})
			.on("show", function(event) { // Fix z-index of datepicker
				//jQuery(".datepicker").css("z-index", parseInt(jQuery(this).closest(".modal").css("z-index"), 10) + 1);
			})
			.on("changeDate", function(event) {
				if(!event.date)return;
				endDate = new Date(event.date.valueOf());
				containerStart.bootstrapDP('setEndDate',endDate);
			});
	}
	function initEstimateSlider(modal) {
		
		var slider = $(".taskEstimateSlider", modal);
		var input = slider.next("input");
		var show = $(".taskSliderValue", modal);
		var currentValue = input.val();

		// Specify fibonacci values for story sizes
		var values = ["-1", "0", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

		show.text(currentValue == -1 ? "???" : values[values.indexOf(currentValue)]);

		// Note that this slider changes index values to fibonacci values
		slider
			.slider({
				tooltip: "hide"
			})
			.on("slide", function(sliderEvent) {
				if (values[sliderEvent.value]) {
					show.text(values[sliderEvent.value] == -1 ? "???" : values[sliderEvent.value]);
					input.val(values[sliderEvent.value]);
				}
			});

		// Set value for slider
		slider
			.slider("setValue", values.indexOf(currentValue));
	}
	function setBacklogTask(tid, bid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;
		if (!bid || bid == 0) return;
		$.ajax({
			type: 'PUT',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid + '/b/' + bid,
			dataType: 'json',
			data: {},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function newTaskAjax(bid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;

		$.ajax({
			type: 'POST',
			url: '/API/p/' + pid + '/s/' + sid + '/t',
			dataType: 'json',
			data: {
				title: $('#formTaskNewTitle').val(),
				estimate: $('#addTaskEstimateInput').val(),
				description: $('#formTaskNewDescription').val(),
				startTime: new Date($('#formSprintNewDateStart').val()),
				deadline: new Date($('#formSprintNewDateEnd').val()),
				type: $('#formTaskNewTypeId').val(),
				executer: $('#formTaskNewOwner').val() || [],
			},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					if (bid)
						setBacklogTask(data.task._id, bid, 0);
					else
						$('body').trigger("loadSprint");
				}
			}
		});
	}

	function buildAdd(title, bid) {
		var buttons = [{
			label: "新建任务",
			className: "btn-primary pull-right",
			callback: function() {
				newTaskAjax(bid)
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog(title, addHtml, buttons);	

		initEstimateSlider(modal);
		modal.on("shown.bs.modal", function() {
			var taskOwner = $('#formTaskNewOwner');

			taskOwner.append(buildMemberOption(g_project.owner._id, g_project.owner.name));
			_.each(g_project.members, function(member) {
				taskOwner.append(buildMemberOption(member._id, member.name));
			});
			taskOwner.multiselect();
		});
		initTaskDate(modal, null);
		
		return modal;
	}
	//use this because jquery ajax not pass [], WTF!
	function removeAllTaskOwner(tid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;
		$.ajax({
			type: 'DELETE',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid + '/ua',
			dataType: 'json',
			data: {},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					//alert('remove all success');                	
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function editTaskAjax(tid, changed) {		
		if(!changed) return;
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;
		$.ajax({
			type: 'PUT',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid,
			dataType: 'json',
			data: {
				title: $('#formTaskEditTitle').val(),
				estimate: $('#editTaskEstimateInput').val(),
				description: $('#formTaskEditDescription').val(),
				startTime: new Date($('#formSprintEditDateStart').val()),
				deadline: new Date($('#formSprintEditDateEnd').val()),
				type: $('#formTaskEditTypeId').val(),
				//executer: $('#formTaskEditOwner').val() || [],
			},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					// if (!$('#formTaskEditOwner').val())
					// 	removeAllTaskOwner(tid);
					// else
						$('body').trigger("loadSprint");
				}
			}
		});
	}

	function deleteTaskAjax(tid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;

		$.ajax({
			type: 'DELETE',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid,
			dataType: 'json',
			data: {},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function setProcess(tid, p) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;
		$.ajax({
			type: 'PUT',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid + '/progress',
			dataType: 'json',
			data: {
				progress: p
			},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function setTaskExecuter(tid, uid, checked){
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;
		$.ajax({
			type: checked? 'PUT' : 'DELETE',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid + '/u/'+uid,
			dataType: 'json',			
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					//$('body').trigger("loadSprint");
				}
			}
		});
	}

	function initSlider(modal, tid) {
		var slider = $(".progressSlider", modal);
		var input = slider.next("input");
		var show = jQuery(".sliderValue", modal);
		var currentValue = input.val();

		show.text(currentValue ? 0 : currentValue);

		// Note that this slider changes index values to fibonacci values
		slider
			.slider({
				tooltip: "hide"
			})
			.on("slide", function(sliderEvent) {
				if (sliderEvent.value) {
					show.text(sliderEvent.value);
					input.val(sliderEvent.value);
				}
			})
			.on('slideStop', function(sliderEvent) {
				//alert(sliderEvent.value)
				setProcess(tid, sliderEvent.value);
			});
	}

	function buildEdit(title, task) {
		var changed = false;
		var buttons = [{
			label: "保存",
			className: "btn-primary pull-right",
			callback: function() {
				editTaskAjax(task._id, changed);
				modal.modal("hide");
				return false;
			}
		}, {
			label: "删除这条任务",
			className: "btn-danger pull-right",
			callback: function() {
				deleteTaskAjax(task._id);
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog(title, editHtml, buttons);

		initSlider(modal, task._id);
		initEstimateSlider(modal);
		modal.on("shown.bs.modal", function() {
			changed = false;
			var taskOwner = $('#formTaskEditOwner');

			if (_.findWhere(task.executer, {
				'_id': g_project.owner._id
			}))
				taskOwner.append(buildSelectedMemberOption(g_project.owner._id, g_project.owner.name));
			else taskOwner.append(buildMemberOption(g_project.owner._id, g_project.owner.name));

			_.each(g_project.members, function(member) {
				if (_.findWhere(task.executer, {
					'_id': member._id
				}))
					taskOwner.append(buildSelectedMemberOption(member._id, member.name));
				else
					taskOwner.append(buildMemberOption(member._id, member.name));
			});
			taskOwner.multiselect({
		    	maxHeight: 400,
		    	onChange: function(element, checked) {
			       console.log($(element).attr('value'));
			       setTaskExecuter(task._id, $(element).attr('value'), checked);
			    }
		    });
			$('.TaskBasicInfo').change(function(){
				console.log('changed');
				changed = true;
			})
			
			$('#formTaskEditTitle').val(task.title);
			$(".progressSlider", modal).slider('setValue', task.progress || -1);
			$(".sliderValue", modal).text(task.progress);
			$(".taskEstimateSlider", modal).slider('setValue', task.estimate || -1);
			$(".taskSliderValue", modal).text(task.estimate);
			$("#editTaskEstimateInput",modal).val(task.estimate);
			$('#formTaskEditDescription').text(task.description);
			$(".taskEstimateSlider").on('slide',function(){
				console.log('changed');
				changed = true;
			})
			$('#taskHistoryTab').click(function(){
				$('#taskHistoryTab').unbind('click');
				$.ajax({
					type: 'GET',
					url: '/API/p/' + pid + '/s/' + sid + '/t/' + task._id + '/h',
					dataType: 'json',			
					success: function(data) {
						if (data.state === 'error')
							bootbox.alert('error! ' + data.message);
						if (data.state === 'success') {		
						$("#tableBody").empty();	
							for(var i=0;i<data.historys.length;i++)	
							{

							    /*var tableline = document.createElement("tr");
							    tableline.appendChild(buildHistoryP(data.historys[i]));	
							    $("tbody").append(tableline);*/
							    //$("tbody").append(buildHistoryP(data.historys[i]));
								//$('tr').append(buildHistoryP(data.historys[i]));
								
								/*var tableline = $('<tr>');
								var tableUnit = $('<td>',{'id':i}).appendTo(tableline);

								tableUnit.append(buildHistoryP(data.historys[i]));
								
								$("#tableBody").append(tableline);*/
								$("#tableBody").append(buildHistoryP(data.historys[i]));
								var divider = $('<hr>');
								$("#tableBody").append(divider);
										
						   }	
						}
					}
				});
				
			})
			
		});
		initTaskDate(modal, {
			start: task.startTime,
			end: task.deadline
		});
		return modal;
	}
	function buildHistoryP(history){
		function formatDate(date){
			return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		}
		function getTaskType(type){
			var r;
			switch(type){
				case '0': r = '开发'; break;
				case '1': r = '测试'; break;
				case '2': r = '设计'; break;
				default: r= '其他';
			}
			return r;
		}
		function getTaskState(state){
			var r;
			switch(state){
				case '0': r = '等待执行';break;
				case '1': r = '完成';break;
				case '2': r = '正在执行';break;
				case '3': r = '等待审核';break;
				case '4': r = '正在审核';break;
			}
			return r;
		}
		var what = formatDate(new Date(history.when)) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		switch(history.type){
			case 0: what += history.who.name + ' 创建了任务: ' + history.what[0] 
			                                + ', 任务描述: ' + history.what[1]
			                                + ', 开始时间: ' + formatDate(new Date(history.what[2]))
			                                + ', 截至日期: ' + formatDate(new Date(history.what[3]))
			                                + ', 任务类型: ' + getTaskType(history.what[4])
			                                + ', 任务点估计: '+ history.what[5];
			if(history.toUser){
				what=what+ ',<br/> 分配给 ';
				for(var i=0;i<history.toUser.length;i++)
					what = what + history.toUser[i].name +' ';
			}
			break;
			case 1: what += history.who.name + ' 设置任务为: ' + history.what[0] 
			                                + ', 任务描述: ' + history.what[1]
			                                + ', 开始时间: ' + formatDate(new Date(history.what[2]))
			                                + ', 截至日期: ' + formatDate(new Date(history.what[3]))
			                                + ', 任务类型: ' + getTaskType(history.what[4])
			                                + ', 任务点估计: '+ history.what[5];
			break;
			case 2: what += history.who.name + ' 增加任务执行者 ' + history.toUser[0].name; break;
			case 3: what += history.who.name + ' 删除任务执行者 ' + history.toUser[0].name; break;
			case 4: what += history.who.name + ' 设置任务状态为: '+ getTaskState(history.what[0]); break;
			case 5: what += history.who.name + ' 设置任务进度为: '+ history.what[0]; break;
		}
		return $('<p >').html(what);		
	}


	var addHtml =
		'<form id="formTaskNew" class="form-horizontal">'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formTaskNewTitle">名称</label>' + '<div class="col-lg-9">' + '<input id="formTaskNewTitle" name="title" type="text" placeholder="任务名称" class="form-control" required="required">' + '</div>' + '</div>'
	//slider
	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="taskEstimate">工作量预估</label>' 

	+ '<div class="col-lg-9">' + '<div id="taskEstimateSlider" class="col-lg-6 taskEstimateSlider"' + 'data-slider-min="0"' + 'data-slider-max="11"' + 'data-slider-step="1"' + 'data-slider-value="-1"' + '></div>'

	+ '<input id="addTaskEstimateInput" name="estimate" type="hidden" value="-1" />'

	+ '<span  class="badge badge-slider taskSliderValue">???</span>' + '</div>' + '</div>'
	//slide end
	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewDateStart">持续时间</label>' + '<label class="col-lg-3 control-label" for="formSprintNewDateEnd" style="display: none;"></label>' + '<div class="col-lg-9">' + '<div class="input-group date dateStart">' + '<input id="formSprintNewDateStart" name="dateStart" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="start"' + 'data-pair="formSprintNewDateEnd"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '<span class="separator">&mdash;</span>' + '<div class="input-group date dateEnd">' + '<input id="formSprintNewDateEnd" name="dateEnd" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="end"' + 'data-pair="formSprintNewDateStart"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskNewTypeId">类型</label>' + '<div class="col-lg-9">' + '<select id="formTaskNewTypeId" name="typeId" class="form-control in-modal show-tick show-menu-arrow">'

	+ '<option value="0" selected="selected">开发</option>' + '<option value="1">测试</option>' + '<option value="2">设计</option>' + '<option value="3">其他</option>' + '</select>' + '</div>' + '</div>'

	//+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditTypeId">所属小组</label>' + '<div class="col-lg-9">' + '<select id="formTaskEditTypeId" name="typeId" class="form-control in-modal show-tick show-menu-arrow">' + '<option value="0" selected="selected">开发部小组</option>' + '<option value="1">技术部小组</option>' + '<option value="2">UI设计组</option>' + '</select>' + '</div>' + '</div>'


	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskNewOwner">执行者</label>' + '<div class="col-lg-9">' + '<select id="formTaskNewOwner" multiple="multiple" name="userId" class="multiselect"' + '>' + '</select>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskNewDescription">描述</label>' + '<div class="col-lg-9">' + '<textarea id="formTaskNewDescription" name="description" class="form-control" data-wysiwyg="true" placeholder="添加任务描述"></textarea>' + '</div>' + '</div>'

	+ '</form>';
	var editHtml =
		'<ul class="nav nav-tabs">' + '<li class="active"> <a href="#basic" data-toggle="tab">基本信息</a> </li>'

	+ '<li> <a id="tasksTab" href="#statistics" data-toggle="tab">进度</a> </li>'

	+ '<li> <a id="taskHistoryTab" href="#history"data-toggle="tab">历史记录</a> </li>' + '</ul>'

	+ '<div class="tab-content" style="margin-top:10px;">' + '<div class="tab-pane active" id="basic">' + '<form id="formTaskEdit" class="form-horizontal">'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formTaskEditTitle">名称</label>' + '<div class="col-lg-9">' + '<input id="formTaskEditTitle" name="title" type="text" placeholder="enter task title" class="form-control TaskBasicInfo" required="required">' + '</div>' + '</div>'
	//slider
	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="taskEstimate">工作量预估</label>' 

	+ '<div class="col-lg-9">' + '<div id="taskEstimateSlider" class="col-lg-6 taskEstimateSlider"' + 'data-slider-min="0"' + 'data-slider-max="11"' + 'data-slider-step="1"' + 'data-slider-value="-1"' + '></div>'

	+ '<input class=" " id="editTaskEstimateInput" name="estimate" type="hidden" value="-1" />'

	+ '<span  class="badge badge-slider taskSliderValue">???</span>' + '</div>' + '</div>'
	//slide end
	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewDateStart">持续时间</label>' + '<label class="col-lg-3 control-label" for="formSprintNewDateEnd" style="display: none;"></label>' + '<div class="col-lg-9">' + '<div class="input-group date dateStart">' + '<input id="formSprintEditDateStart" name="dateStart" type="text" class="dateInput form-control TaskBasicInfo" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="start"' + 'data-pair="formSprintNewDateEnd"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '<span class="separator">&mdash;</span>' + '<div class="input-group date dateEnd">' + '<input id="formSprintEditDateEnd" name="dateEnd" type="text" class="dateInput form-control TaskBasicInfo" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="end"' + 'data-pair="formSprintNewDateStart"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '</div>' + '</div>'


	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditTypeId">类型</label>' + '<div class="col-lg-9">' + '<select id="formTaskEditTypeId" name="typeId" class="form-control in-modal show-tick show-menu-arrow TaskBasicInfo">' + '<option value="0" selected="selected">开发</option>' + '<option value="1">测试</option>' + '<option value="2">设计</option>' + '<option value="3">其他</option>' + '</select>' + '</div>' + '</div>'

	//+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditTypeId">所属小组</label>' + '<div class="col-lg-9">' + '<select id="formTaskEditTypeId" name="typeId" class="form-control in-modal show-tick show-menu-arrow">' + '<option value="0" selected="selected">开发部小组</option>' + '<option value="1">技术部小组</option>' + '<option value="2">UI设计组</option>' + '</select>' + '</div>' + '</div>'


	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditOwner">执行者</label>' + '<div class="col-lg-9">' + '<select id="formTaskEditOwner" name="userId" multiple="multiple" name="userId" class="multiselect">' + '</select>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditDescription">描述</label>' + '<div class="col-lg-9">' + '<textarea id="formTaskEditDescription" name="description" class="form-control  TaskBasicInfo" data-wysiwyg="true" placeholder="添加任务描述"></textarea>' + '</div>' + '</div>' + '</form>' + '</div>'

	+ '<div class="tab-pane" id="statistics">' + '<form class="form-horizontal">' + '<div class="form-group ">' + '<label class="col-lg-3 control-label" for="formTaskProgress">进度</label>' + '<div class="col-lg-9">' + '<div class="col-lg-6 progressSlider"' + 'data-slider-min="0"' + 'data-slider-max="100"' + 'data-slider-step="1"' + 'data-slider-value="0"' + '></div>'

	+ '<input id="formTaskProgress" name="estimate" type="hidden" value="-1" />'

	+ '<span class="badge badge-slider sliderValue">0</span>' + '</div>' + '</div>' + '</form>' + '</div>'

	+ '<div class="tab-pane" id="links"></div>'

	//+ '<div class="tab-pane" id="comments"></div>'

	+ '<div class="tab-pane" id="history" style="max-height:300px;overflow-y:auto;"><div class="table-responsive"><table class="table"><tbody id="tableBody"></tbody></table></div></div></div>' ;

	return {
		addBox: buildAdd,
		editBox: buildEdit
	}
})();