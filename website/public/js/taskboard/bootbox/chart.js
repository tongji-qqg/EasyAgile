var chartBootBox = (function(){

	function initBurndownData(elementName){
		if(g_sprint.burndown.length == 0) return;
		var data = [];
		var total = g_sprint.burndown[0].remain;
		
		var days = moment(g_sprint.endTime).diff(moment(g_sprint.startTime),'days');
		var dayWork = total / days;		
		
		function formatDate(date){
			return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		}
		function generateData(date){
			var formatedDate = formatDate(date);
			total-=dayWork;
			var remain;
			for(var i=0;i<g_sprint.burndown.length;i++){
				var d = new Date(g_sprint.burndown[i].date);					
				if(d.getTime() == date.getTime()) {
					remain = g_sprint.burndown[i].remain;					
					break;
				}
			}
						
			return {
				d: formatedDate,
				Should: total.toFixed(2),
				real: remain
			}
		}
		////////////////////////////////////////////////////////
		var start = new Date(g_sprint.startTime);
		data.push({
			d : formatDate(start),
			Should: total,
			real: total
		});
		start.setDate(start.getDate()+1);
		start = new Date(formatDate(start));
		var end = new Date(g_sprint.endTime);
		for(var d = start; d <= end ;d.setDate(d.getDate()+1)){
			data.push(generateData(d));
		}
		//Morris Line Chart
		Morris.Line({
			// ID of the element in which to draw the chart.
			element: elementName,
			// Chart data records -- each entry in this array corresponds to a point on
			// the chart.
			data: data,
			// The name of the data record attribute that contains x-visitss.
			xkey: 'd',
			// A list of names of data record attributes that contain y-visitss.
			ykeys: ['Should', 'real'],
			// Labels for the ykeys -- will be displayed when you hover over the
			// chart.
			lineColors: ['#16a085','#f39c12'],
			labels: ['Should', 'real'],
			// Disables line smoothing
			smooth: true,
			resize: true
		});
	}
	function buildBurnDownChartBox(){
		var buttons = [{
			label: "确认",
			className: "btn-primary pull-right",
			callback: function() {				
				modal.modal("hide");
				return false;
			}
		}];

		var modal = createBootboxDialog('Burn down chart for '+g_sprint.name, burndownChartHtml, buttons);
		modal.on("shown.bs.modal", function() {
		  initBurndownData('morris-chart-line');
		});				
		return modal;
	}
	var burndownChartHtml = ' <div class="col-lg-12">'
                        +'<div class="portlet portlet-blue">'
                            +'<div class="portlet-heading">'
                                +'<div class="portlet-title">'
                                    +'<h4>Line Chart</h4>'
                                +'</div>'
                                +'<div class="portlet-widgets">'
                                    +'<a href="javascript:;"><i class="fa fa-refresh"></i></a>'
                                    +'<span class="divider"></span>'
                                    +'<a data-toggle="collapse" data-parent="#accordion" href="#lineChart"><i class="fa fa-chevron-down"></i></a>'
                                +'</div>'
                                +'<div class="clearfix"></div>'
                            +'</div>'
                            +'<div id="lineChart" class="panel-collapse collapse in">'
                                +'<div class="portlet-body">'
                                    +'<div id="morris-chart-line"></div>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>';
	return {
		burndownChartBox: buildBurnDownChartBox
	}
})()