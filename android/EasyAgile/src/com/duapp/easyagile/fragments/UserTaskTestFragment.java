package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.TaskActivity;
import com.duapp.easyagile.entities.Task;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;
import com.duapp.easyagile.utils.JSONTransformationUtils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.text.format.Time;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ExpandableListView.OnChildClickListener;
import android.widget.ImageView;
import android.widget.SimpleExpandableListAdapter;
import android.widget.TextView;
import android.widget.Toast;

public class UserTaskTestFragment extends Fragment{

	private ExpandableListView mExpandableListView;
	
	private List<Task> taskList;
	
	private List<List<Task>> list;
	//3 kind task list
	private ArrayList<Task> delayedTaskList;
	private ArrayList<Task> nearDeadlineTaskList;
	private ArrayList<Task> otherTaskList;
	//to put in intent
	private ArrayList<Bundle> delayedTaskBundleList;
	private ArrayList<Bundle> nearDeadlineTaskBundleList;
	private ArrayList<Bundle> otherTaskBundleList;	
	/*
	private List<Map<String,Object>> listGroup;
	private List<List<Map<String,Object>>> listChild;
	private List<Map<String,Object>> delayedList;
	private List<Map<String,Object>> nearDeadlineList;
	private List<Map<String,Object>> otherList;*/
		
	private ExpandAdapter adapter;	
	private Handler handler;
	
	public static UserTaskTestFragment newInstance() {
		UserTaskTestFragment fragment = new UserTaskTestFragment();
		return fragment;
	}
	
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		mExpandableListView = (ExpandableListView)inflater
				.inflate(R.layout.fragment_user_task_test, container, false);
		
		list = new ArrayList<List<Task>>();
		
		taskList = new ArrayList<Task>();
		delayedTaskList = new ArrayList<Task>();
		nearDeadlineTaskList = new ArrayList<Task>();
		otherTaskList = new ArrayList<Task>();
		
		list.add(delayedTaskList);
		list.add(nearDeadlineTaskList);
		list.add(otherTaskList);
		
		delayedTaskBundleList  = new ArrayList<Bundle>();
		nearDeadlineTaskBundleList  = new ArrayList<Bundle>();
		otherTaskBundleList  = new ArrayList<Bundle>();
		
		/*listGroup = new ArrayList<Map<String,Object>>();
		listChild = new ArrayList<List<Map<String,Object>>>();
		delayedList = new ArrayList<Map<String,Object>>();
		nearDeadlineList = new ArrayList<Map<String,Object>>();
		otherList = new ArrayList<Map<String,Object>>();*/
		
		
		handler = new HttpHandler(UserTaskTestFragment.this.getActivity()) {		
			//自己处理成功后的操作
			@Override
			protected void succeed(JSONObject jObject) { 
				super.succeed(jObject);
				
				/*taskTitleList.clear();
				taskTypeList.clear();
				taskDeadlineList.clear();*/
				delayedTaskBundleList.clear();
				delayedTaskList.clear();
				nearDeadlineTaskBundleList.clear();
				nearDeadlineTaskList.clear();
				otherTaskBundleList.clear();
				otherTaskList.clear();
				try {
					JSONArray jsonArray = new JSONArray(jObject.getString("tasks"));

		         	for(int i=0;i<jsonArray.length();i++){
		         		JSONObject jo = jsonArray.getJSONObject(i);
		         		Task task = JSONTransformationUtils.getTask(jo);
		         		taskList.add(task);
		         		
		         		//计算deadline和today的时间差
		         		Time tTime = new Time();
		         		Time currentTime = new Time();
		         		Time today = new Time();
		         		Time deadline = new Time();
		         		
		         		tTime.parse(task.getDeadline().replace("-", ""));		         				         		
		         		currentTime.setToNow();		         			         		
		         		today.set(currentTime.monthDay, currentTime.month, currentTime.year);		
		         		deadline.set(tTime.monthDay, tTime.month, tTime.year);
		         		//时间差
		         		long time = deadline.toMillis(true) - today.toMillis(true);
		         		
		         		// <0; 0-3day; >3day
		         		// to put in intent
		         		if(time < 0){
		         			Bundle info = new Bundle();
		         			info.putString("id", task.get_id());
			         		info.putString("title", task.getTitle());
			         		info.putString("description", task.getDescription());
			         		info.putString("startTime", task.getStartTime());
			         		info.putString("deadline",task.getDeadline());
			         		info.putStringArrayList("executer", task.getExecuterId());			         		
			         		info.putString("createTime", task.getCreateTime());
			         		info.putInt("state", task.getState());
			         		info.putInt("type", task.getType());
			         		info.putInt("progress", task.getProgress());
			         		delayedTaskBundleList.add(info);
		         			delayedTaskList.add(task);
		         		}
		         		else if(time < 1000*60*60*24*3){
		         			Bundle info = new Bundle();
		         			info.putString("id", task.get_id());
			         		info.putString("title", task.getTitle());
			         		info.putString("description", task.getDescription());
			         		info.putString("startTime", task.getStartTime());
			         		info.putString("deadline",task.getDeadline());
			         		info.putStringArrayList("executer", task.getExecuterId());			         		
			         		info.putString("createTime", task.getCreateTime());
			         		info.putInt("state", task.getState());
			         		info.putInt("type", task.getType());
			         		info.putInt("progress", task.getProgress());
			         		nearDeadlineTaskBundleList.add(info);
		         			nearDeadlineTaskList.add(task);
		         		}
		         		else{
		         			Bundle info = new Bundle();
		         			info.putString("id", task.get_id());
			         		info.putString("title", task.getTitle());
			         		info.putString("description", task.getDescription());
			         		info.putString("startTime", task.getStartTime());
			         		info.putString("deadline",task.getDeadline());
			         		info.putStringArrayList("executer", task.getExecuterId());			         		
			         		info.putString("createTime", task.getCreateTime());
			         		info.putInt("state", task.getState());
			         		info.putInt("type", task.getType());
			         		info.putInt("progress", task.getProgress());
			         		otherTaskBundleList.add(info);
		         			otherTaskList.add(task);
		         		}      		
		         		
		         	}
		         	adapter.notifyDataSetChanged();
	            	//sessionid = jsonObject.getString("sessionid");*/
	            } catch (JSONException e) {
	            // TODO Auto-generated catch block
	            	e.printStackTrace();
	            }
			}
			
			@Override
			protected void failed(JSONObject jObject){
				super.failed(jObject);
				Toast.makeText(UserTaskTestFragment.this.getActivity(), "获取数据失败", Toast.LENGTH_SHORT).show();
			}
		};
		
		/*adapter = new SimpleExpandableListAdapter(
				this.getActivity(),
				listGroup,
				android.R.layout.simple_expandable_list_item_1,
				new String[]{
					"name",
				},
				new int[]{
					android.R.id.text1
				},
				listChild,
				R.layout.list_item_task,
				new String[]{
						"task_type_icon",
						"task_title_textView",
						"task_deadline_textView"
				},
				new int[]{
						R.id.task_type_image,
						R.id.task_title_textView,
						R.id.task_deadline_textView
				});*/
		adapter = new ExpandAdapter(this.getActivity(),list);
		
		mExpandableListView.setAdapter(adapter);
		mExpandableListView.setOnChildClickListener(new OnChildClickListener() {
			
			public boolean onChildClick(ExpandableListView parent, View v,
					int groupPosition, int childPosition, long id) {
				// TODO Auto-generated method stub
				switch(groupPosition){
				case 0:
					Intent intent1 = new Intent(getActivity(),TaskActivity.class);
	            	intent1.putExtras(delayedTaskBundleList.get(childPosition));	            	
	            	getActivity().startActivity(intent1);
					break;
				case 1:
					Intent intent2 = new Intent(getActivity(),TaskActivity.class);
	            	intent2.putExtras(nearDeadlineTaskBundleList.get(childPosition));	            	
	            	getActivity().startActivity(intent2);
					break;
				case 2:
					Intent intent3 = new Intent(getActivity(),TaskActivity.class);
	            	intent3.putExtras(otherTaskBundleList.get(childPosition));	            	
	            	getActivity().startActivity(intent3);
					break;
				}
				return true;
			}
		});
		
		return mExpandableListView;
	}
	
/*	
	private void refreshListData(){
		//init group
		listGroup.clear();
		Map<String,Object> map1 = new HashMap<String,Object>();
		Map<String,Object> map2 = new HashMap<String,Object>();
		Map<String,Object> map3 = new HashMap<String,Object>();
		map1.put("name", "已延误的任务" + "(" 
				+ String.valueOf(delayedTaskList.size()) + ")");
		//map1.put("count", String.valueOf(delayedTaskList.size()));
		map2.put("name", "快到期的任务" + "(" 
				+ String.valueOf(nearDeadlineTaskList.size()) + ")");
		//map2.put("count", String.valueOf(nearDeadlineTaskList.size()));
		map3.put("name", "进行中的任务" + "(" 
				+ String.valueOf(otherTaskList.size()) + ")");
		//map3.put("count", String.valueOf(otherTaskList.size()));
		listGroup.add(map1);
		listGroup.add(map2);
		listGroup.add(map3);
		//init child
		listChild.clear();
		delayedList.clear();
		nearDeadlineList.clear();
		otherList.clear();
		//delayed
		for(int i=0;i<delayedTaskList.size();i++){
			Map<String, Object> map = new HashMap<String, Object>();
			int type = delayedTaskList.get(i).getType();
			if(type == 0)
				map.put("task_type_icon", R.drawable.ic_normal);
			if(type == 1)
				map.put("task_type_icon", R.drawable.ic_important);
			if(type == 2)
				map.put("task_type_icon", R.drawable.ic_emergent);
			map.put("task_title_textView", delayedTaskList.get(i).getTitle());
			map.put("task_deadline_textView", "Deadline:" + delayedTaskList.get(i).getDeadline());
			delayedList.add(map); 
		}
		//near deadline
		for(int i=0;i<nearDeadlineTaskList.size();i++){
			Map<String, Object> map = new HashMap<String, Object>();
			int type = nearDeadlineTaskList.get(i).getType();
			if(type == 0)
				map.put("task_type_icon", R.drawable.ic_normal);
			if(type == 1)
				map.put("task_type_icon", R.drawable.ic_important);
			if(type == 2)
				map.put("task_type_icon", R.drawable.ic_emergent);
			map.put("task_title_textView", nearDeadlineTaskList.get(i).getTitle());
			map.put("task_deadline_textView", "Deadline:" + nearDeadlineTaskList.get(i).getDeadline());
			nearDeadlineList.add(map); 
		}
		//other
		for(int i=0;i<otherTaskList.size();i++){
			Map<String, Object> map = new HashMap<String, Object>();
			int type = otherTaskList.get(i).getType();
			if(type == 0)
				map.put("task_type_icon", R.drawable.ic_normal);
			if(type == 1)
				map.put("task_type_icon", R.drawable.ic_important);
			if(type == 2)
				map.put("task_type_icon", R.drawable.ic_emergent);
			map.put("task_title_textView", otherTaskList.get(i).getTitle());
			map.put("task_deadline_textView", "Deadline:" + otherTaskList.get(i).getDeadline());
			otherList.add(map); 
		}
		listChild.add(delayedList);
		listChild.add(nearDeadlineList);
		listChild.add(otherList);
		adapter.notifyDataSetChanged();
	}
	*/
	
	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		((MainActivity) activity).onSectionAttached(
				3);			
	}

	@Override
	public void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
		String url = getString(R.string.url_head)+"/API/u/ta";
		new HttpConnectionUtils(handler).get(url);
	}
	
	private class ExpandAdapter extends BaseExpandableListAdapter{

		private Context mContext;
	    private LayoutInflater mInflater = null;
	    private String[]   mGroupStrings = null;
	    private List<List<Task>>   mChild = null;
	    
	    public ExpandAdapter(Context ctx, List<List<Task>> listChild) {
	        mContext = ctx;
	        mInflater = (LayoutInflater) mContext
	                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	        mGroupStrings = new String[]{
	        		"已延误的任务",
	        		"快到期的任务",
	        		"进行中的任务"
	        };
	        mChild = listChild;
	    }
		
		@Override
		public Task getChild(int groupPosition, int childPosition) {
			// TODO Auto-generated method stub
			return mChild.get(groupPosition).get(childPosition);
		}

		@Override
		public long getChildId(int groupPositon, int childPosition) {
			// TODO Auto-generated method stub
			return childPosition;
		}

		@Override
		public View getChildView(int groupPosition, int childPosition, 
				boolean isLastChild, View convertView, ViewGroup parent) {
			// TODO Auto-generated method stub
			if(convertView == null){
				convertView = mInflater.inflate(R.layout.list_item_task, null);
			}
			ChildViewHolder holder = new ChildViewHolder();
	        holder.mIcon = (ImageView) convertView.findViewById(R.id.task_type_image);
	        
	        int type = getChild(groupPosition, childPosition).getType();
	        if(type == 0)
	        	holder.mIcon.setImageResource(R.drawable.ic_normal);
	        else if(type == 1)
	        	holder.mIcon.setImageResource(R.drawable.ic_important);
	        else if(type == 2)
	        	holder.mIcon.setImageResource(R.drawable.ic_emergent);
	        
	        holder.mChildName = (TextView) convertView.findViewById(R.id.task_title_textView);
	        holder.mChildName.setText(getChild(groupPosition, childPosition).getTitle());
	        holder.mDeadline = (TextView) convertView.findViewById(R.id.task_deadline_textView);
	        holder.mDeadline.setText("Deadline:" + getChild(groupPosition, childPosition).getDeadline());
	        return convertView;
		}

		@Override
		public int getChildrenCount(int groupPosition) {
			// TODO Auto-generated method stub
			return mChild.get(groupPosition).size();
		}

		@Override
		public List<Task> getGroup(int groupPosition) {
			// TODO Auto-generated method stub
			return mChild.get(groupPosition);
		}

		@Override
		public int getGroupCount() {
			// TODO Auto-generated method stub
			return mChild.size();
		}

		@Override
		public long getGroupId(int groupPosition) {
			// TODO Auto-generated method stub
			return groupPosition;
		}

		@Override
		public View getGroupView(int groupPosition, boolean isExpanded, 
				View convertView , ViewGroup parent) {
			// TODO Auto-generated method stub
			if (convertView == null) {
	            convertView = mInflater.inflate(R.layout.expandable_list_group_item, null);
	        }
	        GroupViewHolder holder = new GroupViewHolder();
	        holder.mGroupName = (TextView) convertView
	                .findViewById(R.id.groupName_textView);
	        holder.mGroupName.setText(mGroupStrings[groupPosition]);
	        holder.mGroupCount = (TextView) convertView
	                .findViewById(R.id.groupCount_textView);
	        holder.mGroupCount.setText("(" + mChild.get(groupPosition).size() + ")");
	        return convertView;
		}

		@Override
		public boolean hasStableIds() {
			// TODO Auto-generated method stub
			return false;
		}

		@Override
		public boolean isChildSelectable(int groupPosition, int childPosition) {
			// TODO Auto-generated method stub
			return true;
		}
		
		private class GroupViewHolder {
	        TextView mGroupName;
	        TextView mGroupCount;
	    }

	    private class ChildViewHolder {
	        ImageView mIcon;
	        TextView mChildName;
	        TextView mDeadline;
	    }
	};
	
	
	
	
	
	

}
