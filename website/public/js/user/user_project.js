var uid;

$(function() {
    uid = uid || window.location.href.split('/')[4];
        
    //loadUserInfo();

    loadProjects();
    
});






$(function() {
     $("#showArchivePro").click(function(){
      if($("#showArchivePro").html()=="显示"){
        $("#showArchivePro").text("隐藏");

        $("#finished-project-row").slideToggle("slow");
      }
      else if($("#showArchivePro").html()=="隐藏"){
        $("#showArchivePro").text("显示");
        $("#finished-project-row").slideToggle("slow");
      
      }
    });
});


$('#new-project-button').click(function(){
    var name = $('#new-project-name-input').val();
    var des = $('#new-project-des-input').val();
    
    if(uid){
        $.ajax({
            type: 'POST',
            url: '/API/p',
            dataType: 'json',
            data:{
                name: name,
                des: des
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {    
                    alert('success!');
                    $('#new-project-close').click();
                    loadProjects();
                }
            }            
        });
    }
    
});


function loadProjects(){  

    var newProjectDiv = '<div class="col-lg-3 col-sm-6"> <div class="tile light-gray dash-demo-tile"> <h4><i class="fa fa-plus fa-fw"></i>新建项目</h4> <a  href="#new-project-form" data-toggle="modal" class="dash-demo-footer"> <div id="easy-pie-1" class="easy-pie-chart"> <div style="font-size: 44px;margin-top: 55px"> <i class="fa fa-plus-square-o"></i> </div> </div> </a> </div> </div>';

    function h2d(h) {return parseInt(h,16);} 
    var buildProjectDiv = function(project){
        var colors = ['dark-blue','green','blue','orange','red','purple','yellow'];

        var id = h2d(project._id.substring(23,24))  %  7;
        
        var color = colors[id];        
        var icons = ['fa-check', 'fa-star'];        
        var icon = icons[0];
        if(project.owner == uid)
            icon = icons[1];   
        var percent = 0;

        $.ajax({
            type: 'GET',
            url: '/API/p/'+project._id+'/s/'+project.cSprint._id+'/t',
            dataType: 'json',                       
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {   
                    var total = data.tasks.length;
                    var finish = 0;
                    data.tasks.forEach(function(t){
                        if(t.state == 1) finish ++;
                    })
                    if(total != 0)
                    percent = finish * 100 / total ;  
                    //alert('total '+total+' finish '+finish)     
                    //alert(percent)  
                    if(!project.done)
                    {
                        var div = 
                    '<div class="col-lg-3 col-sm-6"> <div class="tile '+color +' dash-demo-tile"> <h4>' + project.name + '<i class="fa fa-star fa-fw" style="float:right;margin-left:5px;"></i><i class="fa fa-pencil fa-fw" style="float:right;"></i></h4> <div class="easy-pie-chart" data-percent="'+percent+'%"> <span class="percent"></span> </div> <a href=/project/'+project._id+' class="dash-demo-footer">More Info <i class="fa fa-chevron-circle-right"></i></a> </div> </div>' ;
                        $('#current-project-row').append(div);
                    }
                    else
                    {
                        var div = 
                        $('<div class="col-lg-3 col-sm-6"> <div class="tile '+color +' dash-demo-tile"> <h4>' + project.name + '<a class="reuse"><i class="fa fa-refresh fa-fw" style="float:right;"></i></a></h4> <div class="easy-pie-chart" data-percent="'+percent+'"> <span class="percent"></span> </div> <a href=/project/'+project._id+' class="dash-demo-footer">More Info <i class="fa fa-chevron-circle-right"></i></a> </div> </div>');
                        $('.reuse', div).click(function(){
                            console.log('restart project!');
                             $.ajax({
                                type: 'PUT',
                                url: '/API/ps/'+project._id,
                                dataType: 'json',                                
                                success: function(data){
                                    if(data.state === 'error')
                                        alert('error! '+ data.message);
                                    if(data.state === 'success')
                                    {    
                                        alert('success!');                                        
                                        loadProjects();
                                    }
                                }
                            });
                        })
                        $('#finished-project-row').append(div);
                    }
                    $('.easy-pie-chart').easyPieChart({
                        barColor: "rgba(255,255,255,.5)",
                        trackColor: "rgba(255,255,255,.5)",
                        scaleColor: "rgba(255,255,255,.5)",
                        lineWidth: 20,
                        animate: 1500,
                        size: 175,
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    });        
                }
            }            
        });
                
    };  
    if(uid){
        $.ajax({
            type: 'GET',
            url: '/API/u/projects',
            dataType: 'json',
            
            xhrFields: {
                withCredentials: true
            },
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {   
                    $('#current-project-row').empty();
                    $('#finished-project-row').empty();
                    $('#current-project-row').append(newProjectDiv);
                    data.projects.forEach(buildProjectDiv);      
                          
                }
            }            
        });
    }
}
/*
function loadUserInfo(){    
    if(uid){
        $.ajax({
            type: 'GET',
            url: '/API/u',
            dataType: 'json',
            
            xhrFields: {
                withCredentials: true
            },
            success: function(data){

                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                                  
                    $('#top-nav-username').text(data.user.name);
                    $('#user-side-nav-username').text(data.user.name);
                   
                }
            }            
        });
    }
}
*/