$(function(){
	function buildTR(history){
			var tr = $('<tr >');
			var what = history.who.name;
			//console.log(history);
			switch(history.type){
				case 0: what = what + ' 创建了项目 ' + history.what[0] + ' 项目描述 '+ history.what[1]; break;
				case 1: what = what + ' 修改项目信息 '+history.what[0] + ' 项目描述 '+ history.what[1]; break;
				case 2: what = what + ' 邀请用户 '   + history.toUser.name + '加入项目'; break;
				case 3: what = what + ' 邀请用户 '   + history.what[0] +  '加入项目'; break;
				case 4: what = what + ' 接受邀请加入项目'; break;
				case 5: what = what + ' 把 '+ history.toUser.name + ' 移出项目 '; break;
				case 6: what = what + ' 离开了项目'; break;
				case 7: what = what + ' 把 '+ history.toUser.name + ' 设为管理员 '; break;
				case 8: what = what + ' 把 '+ history.toUser.name + ' 设为一般成员 '; break;
				case 9: what = what + ' 把 '+ history.toUser.name + ' 分组设为 '+ (history.what[0]? history.what[0]:'未分组'); break;
				case 10:what = what + ' 创建新的分组 '+ history.what[0]; break;
				case 11:what = what + ' 删除分组 '+ history.what[0]; break;
				case 12:what = what + ' 创建在线文档 '+history.what[0]; break;
				case 13:what = what + ' 删除在线文档 '+history.what[0]; break;
				case 14:what = what + ' 打开 issue '+history.what[0];  break;
				case 15:what = what + ' 关闭 issue '+history.what[0]; break;
				case 16:what = what + ' 删除 issue '+history.what[0]; break;
				case 17:what = what + ' 上传文件 '+history.what[0]; break;
				case 18:what = what + ' 下载文件 '+history.what[0]; break;
				case 19:what = what + ' 删除文件 '+history.what[0]; break;
				case 20:what = what + ' 创建新Sprint '+history.what[0] + ' 描述 '+history.what[1]; break;
				case 21:what = what + ' 删除Sprint '+history.what[0] + ' 描述 '+history.what[1]; break;
				case 22:what = what + ' 设置Sprint '+history.what[0] + ' 为当前Sprint'; break;
				case 23:what = what + ' 发起新话题 '+history.what[0]; break;
				case 24:what = what + ' 删除话题' + history.what[0]; break;
				case 25:what = what + ' 把项目归档'; break;
				case 26:what = what + ' 删除项目'; break;
				case 27:what = what + ' 重新启动了项目 '+history.what[0]; break;
			}
			tr.append($('<td >').text(what));
			tr.append($('<td >').text(formatDate(history.when)));
			return tr;
	}
	function formatDate(date){
		var date = new Date(date);
		return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+ date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	}
	function loadHistory(){
		var end = historyLength;
		var start = historyLength - 5;
		start = start < 0? 0 : start;
		$.ajax({
            type: 'GET',
            url: '/API/p/'+projectid+'/h/'+start+'/'+end,
            dataType: 'json',            
            success: function(data){
                if(data.state === 'error')
                    bootbox.alert( data.message);
                if(data.state === 'success') {
                	var historys = data.historys.reverse();
                	for(var i=0;i<historys.length;i++){
                		$('#mainpage-history-table').append(buildTR(data.historys[i]));
                	}
                }
            }            
        });
	}
	loadHistory();
})