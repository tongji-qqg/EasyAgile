var backlogBootBox = (function() {

	function newBacklogAjax() {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;

		$.ajax({
			type: 'POST',
			url: '/API/p/' + pid + '/s/' + sid + '/b',
			dataType: 'json',
			data: {
				title: $('#formStoryNewTitle').val(),
				description: $('#formStoryNewDescription').val(),
				estimate: $('#formStoryNewEstimate').val()
			},
			success: function(data) {
				if (data.state === 'error')
					bootbox.alert('error! ' + data.message);
				if (data.state === 'success') {
					//alert('success');
					$('body').trigger("loadSprint");
				}
			}
		});
	}

	function initSlider(modal) {
		var slider = $(".estimateSlider", modal);
		var input = slider.next("input");
		var show = jQuery(".sliderValue", modal);
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

	function buildAddBox() {
		var buttons = [{
			label: "Add new backlog",
			className: "btn-primary pull-right",
			callback: function() {
				newBacklogAjax();
				modal.modal("hide");
				return false;
			}
		}, ];
		var modal = createBootboxDialog('New backlog', addHtml, buttons);

		initSlider(modal);

		return modal;
	}

	function editBacklogAjax(bid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!bid || bid == 0) return;
		//alert($('#formStoryNewTitle').val());
		//alert($('#formStoryNewDescription').val());
		//alert($('#formStoryNewEstimate').val());
		$.ajax({
			type: 'PUT',
			url: '/API/p/' + pid + '/s/' + sid + '/b/' + bid,
			dataType: 'json',
			data: {
				title: $('#formStoryNewTitle').val(),
				description: $('#formStoryNewDescription').val(),
				estimate: $('#formStoryNewEstimate').val()
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

	function deleteBacklogAjax(bid) {
		if (!pid || pid == 0) return;
		if (!sid || sid == 0) return;
		if (!bid || bid == 0) return;

		$.ajax({
			type: 'DELETE',
			url: '/API/p/' + pid + '/s/' + sid + '/b/' + bid,
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

	function buildEditBox(backlog) {
		var buttons = [{
			label: "Save",
			className: "btn-primary pull-right",
			callback: function() {
				editBacklogAjax(backlog._id);
				modal.modal("hide");
				return false;
			}
		}, {
			label: "Delete This Backlog",
			className: "btn-danger pull-right",
			callback: function() {
				deleteBacklogAjax(backlog._id);
				modal.modal("hide");
				return false;
			}
		}];
		var modal = createBootboxDialog('Edit backlog &lt;' + backlog.title + '&gt;', addHtml, buttons);

		initSlider(modal);

		modal.on("shown.bs.modal", function() {

			$('#formStoryNewTitle').val(backlog.title);
			$(".estimateSlider", modal).slider('setValue', backlog.estimate || -1);
			$(".sliderValue", modal).text(backlog.estimate == -1 ? "???" : backlog.estimate);
			$('#formStoryNewDescription').text(backlog.description);
		});

		return modal;
	}
	var addHtml =
		'<form id="formStoryNew" class="form-horizontal">'

	+ '<div class="tab-content">' + '<div class="tab-pane active" id="basic">' + '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formStoryNewTitle">Title</label>' + '<div class="col-lg-9">' + '<input id="formStoryNewTitle" name="title" type="text" placeholder="enter story name" class="form-control" required="required" />' + '</div>' + '</div>'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formStoryNewEstimate">Estimate</label>' + '<div class="col-lg-9">' + '<div class="col-lg-6 estimateSlider"' + 'data-slider-min="0"' + 'data-slider-max="11"' + 'data-slider-step="1"' + 'data-slider-value="-1"' + '></div>'

	+ '<input id="formStoryNewEstimate" name="estimate" type="hidden" value="-1" />'

	+ '<span class="badge badge-slider sliderValue">???</span>' + '</div>' + '</div>'

	+ '<div class="form-group required">' + '<label class="col-lg-3 control-label" for="formStoryNewDescription">Description</label>' + '<div class="col-lg-9">' + '<textarea id="formStoryNewDescription" name="description" class="form-control" required="required" data-wysiwyg="true" placeholder="enter user story description"></textarea>' + '</div>' + '</div>' + '</div>'

	+ '</div>' + '</form>';

	return {
		addBox: buildAddBox,
		editBox: buildEditBox
	};
})();