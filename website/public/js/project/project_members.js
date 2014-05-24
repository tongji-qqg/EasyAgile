$(function(){
    function addGroupAjax(name){
        $.ajax({
            type: 'POST',
            url: '/API/p/'+pid+'/g',
            dataType: 'json',
            data:{
                group:name
            },
            success: function(data){                
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {        
                    $('body').trigger('loadProjectAjax');                    
                }
            }            
        });
    }
    function initCreate(){
        $("#link-addgroup").click(function() {
            $("#link-addgroup").hide();
            $("#form-addgroup").show();            
        });
        $("#btn-cancel-addgroup").click(function() {
            $("#form-addgroup").hide();
            $("#link-addgroup").show();            
        });
        $('#btn-addgroup').click(function(){
            $("#form-addgroup").hide();
            $("#link-addgroup").show(); 
            //alert($('#groupName').val())
            addGroupAjax($('#groupName').val());
        })        
    }
    initCreate();
})

$(function(){
    function setGroupAjax(uid, group){
        $.ajax({
            type: 'PUT',
            url: '/API/p/'+pid+'/mg/'+uid,
            dataType: 'json',
            data:{
                group:group
            },
            success: function(data){
                console.log(data.message);
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {        
                    $('body').trigger('loadProjectAjax');                    
                }
            }            
        });
    }
    function initDragDrop(){
        $('.drag-member-div').draggable({
            revert: "invalid",
            revertDuration: 200,                      
            start: function() {
                dragClone = $(this).clone();
            }                  
        });            
        $('.drop-member-div').droppable({
            scroll: true,
            greedy: true,

            drop: function(event, ui) {
                $(this).append($(ui.dragClone));
                var uid = $(ui.draggable).attr('uid');
                var group = $(this).attr('group');
                console.log('uid '+uid);
                console.log('group '+group);
                setGroupAjax(uid,group);
                return true;
            },
            accept: function(elem) {
                return !$(this).has(elem).length;
            }
        });        
    }
    
    $('body').on('initDragDrop', initDragDrop);    
});

$(function(){
    var members;    
    var allGroup;
    var addMemberHtml = '<div class="col-lg-2" style="color: #9cb073; margin-bottom:15px;">'
                            +'<div class="col-lg-4">'
                                +'<img src="/img/add.jpg" class="img-circle" style="width:45px;">'
                            +'</div>'
                            +'<div class="col-lg-8" style="margin-top:10px;">添加成员</div>'
                        +'</div>';
    var groupHtml  = '<div class="row">'
                        +'<br />'
                        +'<br />'
                        +'<div class="col-lg-1">'
                            +'<div class="col-lg-12">'
                                +'<label class="groupName label label-info" style="margin-top=10px;">开发部小组</label>'
                            +'</div>'
                        +'</div>'
                        +'<div class="col-lg-1">'
                            +'<div class="col-lg-12">'
                                +'<label class="label label-delete" style="color:#008B8B;font-size:small;cursor:pointer;">删除</label>'
                            +'</div>'
                        +'</div>'
                        +'<div class="col-lg-1">'
                            +'<div class="col-lg-12">'
                                +'<label class="label label-click" style="color:#008B8B;font-size:small;cursor:pointer;">收起</label>'
                            +'</div>'
                        +'</div>'

                        +'<div class="col-lg-9">'
                            +'<div class="col-lg-12">'
                                +'<hr style="border-top-color:#fff;margin-top:10px;}">'
                            +'</div>'
                        +'</div>'



                    +'</div>';
                    /*
                    +'<div class="row drop-member-div" style="min-height:150px;">'
                                               
                    +'</div>';*/
    function loadProjectAjax(){
        if (!pid) return;
        $.ajax({
            type: 'GET',
            url: '/API/p/' + pid,
            dataType: 'json',
            success: function(data) {

                if (data.state === 'error')
                    alert('error! ' + data.message);
                if (data.state === 'success') {
                    members = data.project.members;                    
                    members.unshift({
                        _id: data.project.owner._id,
                        name: data.project.owner.name,
                        icon: data.project.owner.icon,
                        isAdmin: true,
                        group: data.project.ownerGroup
                    });
                    allGroup = data.project.groups;
                    build();    
                }
            }
        });//end ajax
    }
    function deleteGroupAjax(name){
        $.ajax({
            type: 'DELETE',
            url: '/API/p/'+pid+'/g',
            dataType: 'json',
            data:{
                group:name
            },
            success: function(data){                
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {        
                    $('body').trigger('loadProjectAjax');                    
                }
            }            
        });
    }
    function buildMemberDiv(member){
        var div = $('<div >',{'uid':member._id,'class':'col-lg-2 drag-member-div','style':'margin-bottom:15px;cursor:pointer;'});
        var divl = $('<div >',{'class':'col-lg-3'}).appendTo(div);
        var icon = '/usericons/default.jpg';
        if(member.icon) icon = '/'+member.icon;
        $('<img >',{'src':icon,'class':'img-circle','style':'width:45px;'}).appendTo(divl);
        var divr = $('<div >',{'class':'col-lg-9'}).appendTo(div);
        var divrl = $('<div >',{'class':'col-lg-12'}).appendTo(divr);
        $('<span >').text(member.name).appendTo(divrl);
        var divrr = $('<div >',{'class':'col-lg-12'}).appendTo(divr);
        var role = '成员';
        if(member.isAdmin) role = '管理员';
        $('<span >',{'style':'color: #999;'}).text(role).appendTo(divrr);
        return div;
    }
    function build(){
        groups = _.groupBy(members,function(m){ return m.group; });
        $('#undefined-members').empty();
        $('#undefined-members').append($(addMemberHtml));
        $('#undefined-members').attr('group',null);
        if(groups.undefined){
            groups.undefined.forEach(function(m){
                var div = buildMemberDiv(m);
                $('#undefined-members').append(div);
            });
            delete groups.undefined;
        }
        $('#defined-members').empty();
        for (var property in groups) {
            if (groups.hasOwnProperty(property)) {
                allGroup = _.without(allGroup,property);
                var group = $(groupHtml);                
                $('#defined-members').append(group);
                $('.groupName',group).text(property);
                $('.label-delete',group).attr('group',property);
                var dmdiv = $('<div >',{'class':'row drop-member-div','style':'min-height:150px;'}).appendTo($('#defined-members'));
                dmdiv.attr('group',property);
                groups[property].forEach(function(m){    
                    var memdiv = buildMemberDiv(m);
                    dmdiv.append(memdiv);
                    //memdiv.appendTo($('drop-member-div',group));
                })                
            }
        }
        allGroup.forEach(function(g){
            var group = $(groupHtml);                
            $('#defined-members').append(group);
            $('.groupName',group).text(g);
            $('.label-delete',group).attr('group',g);
            var dmdiv = $('<div >',{'class':'row drop-member-div','style':'min-height:150px;'}).appendTo($('#defined-members'));
            dmdiv.attr('group',g);
        })
        
        $('body').trigger('initDragDrop');        
        $(".label-click").click(function() {
            if($(this).text() == '收起')$(this).text('放下');
            else if($(this).text() == '放下')$(this).text('收起'); 
            $(this).parent().parent().parent().next().toggle();
        });
        $('.label-delete').click(function(){
            groupName = $(this).attr('group');
            //alert(groupName);
            deleteGroupAjax(groupName);
        })
    }
    $('body').on('loadProjectAjax',loadProjectAjax);
    loadProjectAjax();
});       