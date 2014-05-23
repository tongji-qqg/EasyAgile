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
			label: "Add new Sprint",
			className: "btn-primary pull-right",
			callback: function() {
				addSprintAjax();
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog('create sprint', addHtml, buttons);

		modal.on("shown.bs.modal", function() {

		});
		initSprintDate(modal, null);
		return modal;
	}

	function buildEdit() {
		var buttons = [{
			label: "Save",
			className: "btn-primary pull-right",
			callback: function() {
				editSPrintAjax();
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog('Edit sprint &lt;' + g_sprint.name + '&gt;', addHtml, buttons);
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

	function buildDelete() {

	}

	function buildChart() {

	}
	var addHtml =
		'<form id="formSprintNew" class="form-horizontal">'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewTitle">Title</label>' + '<div class="col-lg-9">' + '<input id="formSprintNewTitle" name="title" type="text" placeholder="enter sprint name" class="form-control" required="required" />' + '</div>' + '</div>'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formSprintNewDateStart">Duration</label>' + '<label class="col-lg-3 control-label" for="formSprintNewDateEnd" style="display: none;"></label>' + '<div class="col-lg-9">' + '<div class="input-group date dateStart">' + '<input id="formSprintNewDateStart" name="dateStart" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="start"' + 'data-pair="formSprintNewDateEnd"' + 'data-focus="false"' + 'data-type="sprint"/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '<span class="separator">&mdash;</span>' + '<div class="input-group date dateEnd">' + '<input id="formSprintNewDateEnd" name="dateEnd" type="text" class="dateInput form-control" size="16" required="required"' + 'data-validate-type="daterange"' + 'data-role="end"' + 'data-pair="formSprintNewDateStart"' + 'data-focus="false"' + 'data-type="sprint"' + '/>' + '<span class="input-group-addon add-on"><i class="fa fa-calendar"></i></span>' + '</div>' + '</div>' + '</div>'

	+ '<div class="form-group">' + '<label class="col-lg-3 control-label" for="formSprintNewDescription">Description</label>' + '<div class="col-lg-9">' + '<textarea id="formSprintNewDescription" name="description" class="form-control" data-wysiwyg="true" placeholder="enter sprint description"></textarea>' + '</div>' + '</div>' + '</form>';

	return {
		addBox: buildAdd,
		editBox: buildEdit
	}
})();