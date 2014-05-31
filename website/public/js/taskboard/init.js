$(function() {
        var datepicker = $.fn.datepicker.noConflict();
        $.fn.bootstrapDP = datepicker;
});


$(init);

$(function(){
    $('#show-my-task').bootstrapSwitch({
        'onText':'全部任务',
        'offText':'我的任务',
        'onSwitchChange':function(event, state){
            jQuery("body").trigger("loadSprint");        
        }
    });    
})

var g_project, g_sprint;

function init() {
    
    var body = jQuery("body");

    body.on('loadUser', loadUser);
    body.on('loadProject', loadProject);
    body.on('loadSprint', loadSprint);
    body.on('loadSprintManagement', loadSprintManagement);

    body.trigger("loadUser");
    body.trigger("loadProject");
    //body.trigger("loadSprint");

    function subscribe(){
        if (!pid || pid == 0) return;
        if (!sid || sid == 0) return;
        socket.get('/API/p/'+pid+'/s/'+sid+'/sub',null,function(){});
        socket.on('sprint',function updateSprint(message){
            //alert('update sprint '+ message.what);
            if(message.sid === sid)
                loadSprint();
        });
        socket.on('sprintDelete',function updateSprint(message){
            //alert('update sprint '+ message.what);
            if(message.sid === sid){
                sid = g_project.cSprint;                
            }
            body.trigger("loadProject");
            //body.trigger("loadSprint");                
        });
    }
    subscribe();

    function loadUser() {
        if (!uid) return;
        jQuery("#navigation").show();
    }

    function loadProject() {
        var selectedSprintLi;
        var buildSprintList = function(sprintId, liClass, aClass, spanText) {

            if(sprintId === sid)
                spanText += '*';
            var sprintList = $('#allSprints');

            var li = $("<li />", {
                'id': sprintId,
                'class': liClass
            }).appendTo(sprintList);
            var a = $('<a />', {
                'class': aClass
            }).appendTo(li);
            var span = $('<span />', {
                'class': 'text'
            }).appendTo(a);
            span.text(spanText);

            li.click(function() {
                if (this == li) return;
                else {
                    selectedSprintLi.attr({
                        'class': ''
                    });
                    selectedSprintLi = li;
                    selectedSprintLi.attr({
                        'class': 'selected'
                    });
                    //alert(li.attr('id'));
                    $('#selectSprint').text(selectedSprintLi.text());
                    sid = li.attr('id');
                    loadSprint(sid);
                }
            });
            return li;
        }
        if (!pid) return;
        $.ajax({
            type: 'GET',
            url: '/API/p/' + pid,
            dataType: 'json',
            success: function(data) {

                if (data.state === 'error')
                    bootbox.alert('error! ' + data.message);
                if (data.state === 'success') {
                    sid = sid || data.project.cSprint;
                    g_project = data.project;

                    $('#navTitle').text(data.project.name);
                    $('#navTitle').attr('href','/project/'+data.project._id);
                    var sprintList = $('#allSprints');
                    sprintList.empty();
                    //buildSprintList('tipSprintLi', '', "select-dummy-option text-muted", "Choose sprint to show");

                    data.project.sprints.forEach(function(sprint) {
                        if (sprint._id == sid) {
                            $('#selectSprint').text(sprint.name);
                            selectedSprintLi = buildSprintList(sprint._id, 'selected', '', sprint.name);
                        } else
                            buildSprintList(sprint._id, '', '', sprint.name);
                    });
                    body.trigger("loadSprintManagement");
                    body.trigger("loadSprint");
                }
            }
        });
        jQuery("#navigation").show();
    }

    function loadSprintManagement() {
        function setAsCurrentSprint(){
            if (!pid || pid == 0) return;
            if (!sid || sid == 0) return;
            $.ajax({
                type: 'GET',
                url: '/API/p/' + pid + '/s/' + sid + '/start',
                dataType: 'json',                
                success: function(data) {
                    if (data.state === 'error')
                        bootbox.alert('error! ' + data.message);
                    if (data.state === 'success') {
                        bootbox.alert('success');
                        body.trigger("loadProject");
                    }
                }
            });
        }
        $('#addSprintLink').unbind('click');
        $('#addSprintLink').on('click', function() {
            sprintBootBox.addBox().modal('show');
        });
        $('#editSprintLink').unbind('click');
        $('#editSprintLink').on('click', function() {
            sprintBootBox.editBox().modal('show');
        });
        $('#showSprintChartsLink').unbind('click');
        $('#showSprintChartsLink').on('click', function() {
            //bootbox.alert('click')
            chartBootBox.burndownChartBox().modal('show');
        });
        $('#setCurrentSprintLink').unbind('click');
        $('#setCurrentSprintLink').on('click', function() {
            setAsCurrentSprint();
        });
        $('#deleteSprintLink').unbind('click');
        $('#deleteSprintLink').on('click', function() {
            bootbox.confirm('are you sure?',function(result){
                if(result){
                    console.log('message');
                    $.ajax({
                        type: 'DELETE',
                        url: '/API/p/' + pid + '/s/' + sid,
                        dataType: 'json',                
                        success: function(data) {
                            if (data.state === 'error')
                                bootbox.alert('error! ' + data.message);
                            if (data.state === 'success') {
                                bootbox.alert('success');
                                sid = g_project.cSprint;
                                body.trigger("loadProject");
                                body.trigger('loadSprint');
                            }
                        }
                    });
                }
            })
        });
        $('#showSprintHistoryLink').unbind('click');
        $('#showSprintHistoryLink').on('click', function() {
            //console.log('message');            
            sprintBootBox.historyBox().modal('show');                                  
        });

    }

    function loadSprint() {
        var tmpTasksRef;

      

        function setTaskState(tid, state) {
            if (!pid || pid == 0) return;
            if (!sid || sid == 0) return;
            if (!tid || tid == 0) return;
            $.ajax({
                type: 'PUT',
                url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid,
                dataType: 'json',
                data: {
                    state: state
                },
                success: function(data) {
                    if (data.state === 'error')
                        bootbox.alert('error! ' + data.message);
                    if (data.state === 'success') {
                        body.trigger("loadSprint");
                    }
                }
            });
        }

        function setBacklogTask(tid, bid, state) {
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
                    if (data.state === 'error'){
                            bootbox.alert('error! ' + data.message);
                            body.trigger("loadSprint");
                        }
                    if (data.state === 'success') {
                        setTaskState(tid, state);
                    }
                }
            });
        }

        function unsetBacklogTask(tid, state) {
            if (!pid || pid == 0) return;
            if (!sid || sid == 0) return;
            if (!tid || tid == 0) return;
            $.ajax({
                type: 'PUT',
                url: '/API/p/' + pid + '/s/' + sid + '/t/' + tid + '/nob',
                dataType: 'json',
                data: {},
                success: function(data) {
                    if (data.state === 'error'){
                            bootbox.alert('error! ' + data.message);
                            body.trigger("loadSprint");
                        }
                    if (data.state === 'success') {
                        setTaskState(tid, state);
                    }
                }
            });
        }
        var removeTaskRefById = function(id) {
            tmpTasksRef = _.reject(tmpTasksRef, function(item) {
                return item._id === id; // or some complex logic
            });
        };

        function setSum(element, sum) {
            if (!sum) sum = 0;
            element.text('(' + sum + ')');
        }

        function buildTd(bid, state) {
            var td = $('<td />', {
                'class': 'myClass ui-sortable',
                'style': 'width: 16.6%;'
            });
            td.droppable({
                scroll: true,
                greedy: true,
                drop: function(event, ui) {
                    $(this).append($(ui.dragClone));
                    return true;
                },
                accept: function(elem) {
                    return !$(this).has(elem).length;
                }
            });
            td.on('drop', function(event, ui) {
                //setBacklogTask(elem.id,bid,state);                
                if (bid)
                    setBacklogTask(ui.draggable.attr('id'), bid, state);
                else
                    unsetBacklogTask(ui.draggable.attr('id'), state);
            });
            return td;
        }

        function buildTaskDiv(task) {
            var permission = false;
            for(var i=0;i<task.executer.length;i++)
                if(task.executer[i]._id == uid){
                    permission = true;
                }                
            if(!permission && !$('#show-my-task').is( ":checked" ))return;
            var divClass = 'task sticky taped generated_qtip alert alert-warning';
            if (task.type == 1)
                divClass = 'task sticky taped alert alert-success';
            if (task.type == 2)
                divClass = 'task sticky taped alert alert-danger';
            if (task.type == 3)
                divClass = 'task sticky taped alert alert-info'

            var div = $('<div >', {
                'id': task._id,
                'class': divClass
            });
            $('<div >', {
                'class': 'gravatar'
            }).appendTo(div);
            $('<i >', {
                'class': 'fa fa-circle myTask'
            }).appendTo(div);
            var h3 = $('<h3 >').appendTo(div);
            h3.text(task.title);
            
            if(g_project.owner._id == uid) permission = true;            
            //if(permission){
                div.draggable({
                        revert: "invalid",
                        revertDuration: 200,
                        start: function() {
                            dragClone = $(this).clone();
                        }
                });
                div.dblclick(function() {
                    taskBootBox.editBox('编辑任务: &lt;' + task.title + '&gt;', task).modal('show');
                });
            //}
            
            return div;
        }

        function buildTR(backlog, other) {
            var tr = $('<tr />');
            var th = $('<th />', {
                'style': 'width:17%'
            }).appendTo(tr);
            var div = $('<div >', {
                'class': 'story alert alert-info taped'
            }).appendTo(th);
            var h3 = $('<h3 />').appendTo(div);
            h3.text(backlog.title + ' (' + backlog.tasks.length + ')');

            if (!other)
                div.dblclick(function() {
                    backlogBootBox.editBox(backlog).modal('show');
                })
            var td = $('<td />', {
                'class': 'addTask'
            }).appendTo(tr);
            var addTaskButton = $('<button >').appendTo(td);
            if (other) {
                addTaskButton.on('click', function() {

                    taskBootBox.addBox('创建任务').modal('show');

                });
            } else {
                addTaskButton.on('click', function() {

                    taskBootBox.addBox('创建任务到backlog &lt;' + backlog.title + '&gt;', backlog._id).modal('show');
                });
            }
            addTaskButton.html('<i class="fa fa-plus"></i>');
            var waitingTd = buildTd(backlog._id, 0);
            var processTd = buildTd(backlog._id, 2);
            var toReviewTd = buildTd(backlog._id, 3);
            var reviewedTd = buildTd(backlog._id, 4);
            var doneTd = buildTd(backlog._id, 1);
            backlog.tasks.forEach(function(task) {
                var taskDiv, taskState;
                if (task._id) { //from task array
                    taskDiv = buildTaskDiv(task);
                    removeTaskRefById(task._id);
                    taskState = task.state;
                } else { //from backlog array
                    var t = _.findWhere(tmpTasksRef, {
                        '_id': task
                    });
                    if (!t) return;
                    taskDiv = buildTaskDiv(t);
                    taskState = t.state;
                    removeTaskRefById(task);
                }
                switch (taskState) {
                    case 1:
                        doneTd.append(taskDiv);
                        break;
                    case 2:
                        processTd.append(taskDiv);
                        break;
                    case 3:
                        toReviewTd.append(taskDiv);
                        break;
                    case 4:
                        reviewedTd.append(taskDiv);
                        break;
                    default:
                        waitingTd.append(taskDiv);
                        break;
                }
            });
            tr.append(waitingTd);
            tr.append(processTd);
            tr.append(toReviewTd);
            tr.append(reviewedTd);
            tr.append(doneTd);
            return tr;
        }
        ///////////////////////////////////////
        ////////////load  process//////////////
        ////////////             //////////////
        ///////////////////////////////////////
        if (!pid || pid == 0) return;
        if (!sid || sid == 0) return;
        $.ajax({
            type: 'GET',
            url: '/API/p/' + pid + '/s/' + sid,
            dataType: 'json',
            success: function(data) {

                if (data.state === 'error')
                    bootbox.alert('error! ' + data.message);
                if (data.state === 'success') {
                    g_sprint = data.sprint;
                    setSum($('#backlogSum'), data.sprint.backlogs.length);
                    var states = _.countBy(data.sprint.tasks, function(task) {
                        switch (task.state) {
                            case 0:
                                return 'waiting';
                            case 1:
                                return 'done';
                            case 2:
                                return 'process';
                            case 3:
                                return 'toReview';
                            case 4:
                                return 'reviewed';
                            default:
                                return 'waiting';
                        }
                    });
                    setSum($('#waitingSum'), states.waiting);
                    setSum($('#inProcessSum'), states.process);
                    setSum($('#toReviewSum'), states.toReview);
                    setSum($('#reviewedSum'), states.reviewed);
                    setSum($('#doneSum'), states.done);

                    $('#addBacklogButton').unbind('click');
                    $('#addBacklogButton').on('click', function() {

                        backlogBootBox.addBox().modal('show');                                                            
                    });
                    ////////////////////////////////////////
                    //////////load sprint task info/////////
                    ////////////////////////////////////////
                    tmpTasksRef = _.clone(data.sprint.tasks);
                    $('#boardTable > tbody').empty();
                    data.sprint.backlogs.forEach(function(backlog) {
                        $('#boardTable').append(buildTR(backlog, false));
                    });


                    $('#boardTable').append(buildTR({
                        title: 'Other Tasks',
                        tasks: tmpTasksRef
                    }, true));
                }
            }
        });
        jQuery("#boardContent").show();
    }

}


/*

    $('#drag').draggable({
         revert: "invalid",
         revertDuration : 200,
         start : function() {
                dragClone = $(this).clone();                
         }
    });

    $('#drop').droppable({
        scroll: true,
        drop: function (event, ui) {
            //$(this).append(ui.draggable);
            //$(ui.draggable).appendTo($(this));
            $(this).append($(ui.dragClone));
            return true;       
        }
    });


  function addTask() {
            if (!pid || pid == 0) return;
            if (!sid || sid == 0) return;
            $.ajax({
                type: 'POST',
                url: '/API/p/' + pid + '/s/' + sid + '/t',
                dataType: 'json',
                data: {
                    title: 'this is a task',
                    description: 'this is des',
                    level: 1,
                    type: 2
                },
                success: function(data) {
                    if (data.state === 'error')
                        alert('error! ' + data.message);
                    if (data.state === 'success') {
                        body.trigger("loadSprint");
                    }
                }
            });
        }
*/