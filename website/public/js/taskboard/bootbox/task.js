var taskBootBox = (function() {
	function buildMemberOption(id, name) {
		return '<option value="' + id + '">' + name + '</option>';
	}

	function buildSelectedMemberOption(id, name) {
		return '<option value="' + id + '"selected="selected">' + name + '</option>';
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
					alert('error! ' + data.message);
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
				description: $('#formTaskNewDescription').val(),
				startTime: new Date($('#formSprintNewDateStart').val()),
				deadline: new Date($('#formSprintNewDateEnd').val()),
				type: $('#formTaskNewTypeId').val(),
				executer: $('#formTaskNewOwner').val() || [],
			},
			success: function(data) {
				if (data.state === 'error')
					alert('error! ' + data.message);
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
			label: "Add new Task",
			className: "btn-primary pull-right",
			callback: function() {
				newTaskAjax(bid)
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog(title, addHtml, buttons);

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
					alert('error! ' + data.message);
				if (data.state === 'success') {
					//alert('remove all success');                	
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function editTaskAjax(tid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!tid || tid == 0) return;

		$.ajax({
			type: 'PUT',
			url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid,
			dataType: 'json',
			data: {
				title: $('#formTaskEditTitle').val(),
				description: $('#formTaskEditDescription').val(),
				startTime: new Date($('#formSprintEditDateStart').val()),
				deadline: new Date($('#formSprintEditDateEnd').val()),
				type: $('#formTaskEditTypeId').val(),
				executer: $('#formTaskEditOwner').val() || [],
			},
			success: function(data) {
				if (data.state === 'error')
					alert('error! ' + data.message);
				if (data.state === 'success') {
					if (!$('#formTaskEditOwner').val())
						removeAllTaskOwner(tid);
					else
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
					alert('error! ' + data.message);
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
					alert('error! ' + data.message);
				if (data.state === 'success') {
					$('body').trigger("loadSprint");
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
		var buttons = [{
			label: "Save",
			className: "btn-primary pull-right",
			callback: function() {
				editTaskAjax(task._id);
				modal.modal("hide");
				return false;
			}
		}, {
			label: "DeleteThisTask",
			className: "btn-danger pull-right",
			callback: function() {
				deleteTaskAjax(task._id);
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog(title, editHtml, buttons);

		initSlider(modal, task._id);

		modal.on("shown.bs.modal", function() {
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
			taskOwner.multiselect();

			$('#formTaskEditTitle').val(task.title);
			$(".progressSlider", modal).slider('setValue', task.progress || -1);
			$(".sliderValue", modal).text(task.progress);
			$('#formTaskEditDescription').text(task.description);
		});
		initTaskDate(modal, {
			start: task.startTime,
			end: task.deadline
		});
		return modal;
	}


	var addHtml =
		'<form id="formTaskNew" class="form-horizontal">'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formTaskNewTitle">Title</label>' + '<div class="col-lg-9">' + '<input id="formTaskNewTitle" name="title" type="text" placeholder="enter task title" class="form-control" required="required">' + '</div>' + '</div>'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewDateStart">Duration</label>' + '<label class="col-lg-3 control-label" for="formSprintNewDateEnd" style="display: none;"></label>' + '<div class="col-lg-9">' + '<div class="input-group date dateStart">' + '<input id="formSprintNewDateStart" name="dateStart" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="start"' + 'data-pair="formSprintNewDateEnd"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '<span class="separator">&mdash;</span>' + '<div class="input-group date dateEnd">' + '<input id="formSprintNewDateEnd" name="dateEnd" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="end"' + 'data-pair="formSprintNewDateStart"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskNewTypeId">Type</label>' + '<div class="col-lg-9">' + '<select id="formTaskNewTypeId" name="typeId" class="form-control in-modal show-tick show-menu-arrow">'

	+ '<option value="0" selected="selected">Normal</option>' + '<option value="1">Test</option>' + '<option value="2">Debug</option>' + '</select>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskNewOwner">Owner</label>' + '<div class="col-lg-9">' + '<select id="formTaskNewOwner" multiple="multiple" name="userId" class="multiselect"' + '>' + '</select>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskNewDescription">Description</label>' + '<div class="col-lg-9">' + '<textarea id="formTaskNewDescription" name="description" class="form-control" data-wysiwyg="true" placeholder="enter task description"></textarea>' + '</div>' + '</div>'

	+ '</form>';
	var editHtml =
		'<ul class="nav nav-tabs">' + '<li class="active"> <a href="#basic" data-toggle="tab">Basic</a> </li>'

	+ '<li> <a id="tasksTab" href="#statistics" data-toggle="tab">Statistics</a> </li>'

	+ '<li> <a href="#comments" data-toggle="tab">Comments</a> </li>'

	+ '<li> <a href="#history"data-toggle="tab">History</a> </li>' + '</ul>'

	+ '<div class="tab-content">' + '<div class="tab-pane active" id="basic">' + '<form id="formTaskEdit" class="form-horizontal">'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formTaskEditTitle">Title</label>' + '<div class="col-lg-9">' + '<input id="formTaskEditTitle" name="title" type="text" placeholder="enter task title" class="form-control" required="required">' + '</div>' + '</div>'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewDateStart">Duration</label>' + '<label class="col-lg-3 control-label" for="formSprintNewDateEnd" style="display: none;"></label>' + '<div class="col-lg-9">' + '<div class="input-group date dateStart">' + '<input id="formSprintEditDateStart" name="dateStart" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="start"' + 'data-pair="formSprintNewDateEnd"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '<span class="separator">&mdash;</span>' + '<div class="input-group date dateEnd">' + '<input id="formSprintEditDateEnd" name="dateEnd" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="end"' + 'data-pair="formSprintNewDateStart"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '</div>' + '</div>'


	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditTypeId">Type</label>' + '<div class="col-lg-9">' + '<select id="formTaskEditTypeId" name="typeId" class="form-control in-modal show-tick show-menu-arrow">' + '<option value="0" selected="selected">Normal</option>' + '<option value="1">Test</option>' + '<option value="2">Debug</option>' + '</select>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditOwner">Owner</label>' + '<div class="col-lg-9">' + '<select id="formTaskEditOwner" name="userId" multiple="multiple" name="userId" class="multiselect">' + '</select>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formTaskEditDescription">Description</label>' + '<div class="col-lg-9">' + '<textarea id="formTaskEditDescription" name="description" class="form-control" data-wysiwyg="true" placeholder="enter task description"></textarea>' + '</div>' + '</div>' + '</form>' + '</div>'

	+ '<div class="tab-pane" id="statistics">' + '<form class="form-horizontal">' + '<div class="form-group ">' + '<label class="col-lg-3 control-label" for="formTaskProgress">Progress</label>' + '<div class="col-lg-9">' + '<div class="col-lg-6 progressSlider"' + 'data-slider-min="0"' + 'data-slider-max="100"' + 'data-slider-step="1"' + 'data-slider-value="0"' + '></div>'

	+ '<input id="formTaskProgress" name="estimate" type="hidden" value="-1" />'

	+ '<span class="badge badge-slider sliderValue">0</span>' + '</div>' + '</div>' + '</form>' + '</div>'

	+ '<div class="tab-pane" id="links"></div>'

	+ '<div class="tab-pane" id="comments"></div>'

	+ '<div class="tab-pane" id="history"></div>' + '</div>';

	return {
		addBox: buildAdd,
		editBox: buildEdit
	}
})();