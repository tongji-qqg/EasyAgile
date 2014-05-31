package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v4.widget.SwipeRefreshLayout.OnRefreshListener;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.ProjectActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.TaskActivity;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;

public class ProjectTaskFragment extends Fragment{

	private ListView mListView;
	private SwipeRefreshLayout swipeLayout;
	
	private SimpleAdapter adapter;
	private ArrayList<String> taskTitleList;
	private ArrayList<Integer> taskTypeList;
	private ArrayList<String> taskDeadlineList;
	private ArrayList<Bundle> taskBundleList;
	private List<Map<String, Object>> list;
	private String projectId = null;
	private String currentSprintId = null;
	private Handler handler;
	
		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		//private static final String ARG_SECTION_NUMBER = "3";

		/**
		 * Returns a new instance of this fragment for the given userdata.
		 */
		public static ProjectTaskFragment newInstance(Bundle bundle) {
			ProjectTaskFragment fragment = new ProjectTaskFragment();
			fragment.setArguments(bundle);
			return fragment;
		}
		

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			projectId = this.getArguments().getString("projectId");
			currentSprintId = this.getArguments().getString("currentSprintId");
			
			list = new ArrayList<Map<String, Object>>(); 
			taskTitleList = new ArrayList<String>();
			taskDeadlineList = new ArrayList<String>();
			taskTypeList = new ArrayList<Integer>();
			taskBundleList  = new ArrayList<Bundle>();
			
			handler = new HttpHandler(ProjectTaskFragment.this.getActivity()) {		
				//自己处理成功后的操作
				@Override
				protected void succeed(JSONObject jObject) { 
					super.succeed(jObject);
					
					taskTitleList.clear();
					taskDeadlineList.clear();
					taskTypeList.clear();
					taskBundleList.clear();
					try {
						JSONArray jsonArray = new JSONArray(jObject.getString("tasks"));

			         	for(int i=0;i<jsonArray.length();i++){
			         		JSONObject jo = jsonArray.getJSONObject(i);
			         		ArrayList<String> execList = new ArrayList<String>();
			         		Bundle info = new Bundle();
			         		taskTitleList.add(jo.getString("title"));
			         		taskTypeList.add(jo.getInt("type"));
			         		taskDeadlineList.add(jo.getString("deadline").substring(0, 10));
			         		
			         		JSONArray exec = jo.getJSONArray("executer");
			         		for(int j=0;j<exec.length();j++){
			         			execList.add(exec.getString(j));
			         		}
			         		
			         		info.putString("id", jo.getString("_id"));
			         		info.putString("title", jo.getString("title"));
			         		info.putString("description", jo.getString("description"));
			         		info.putString("startTime", jo.getString("startTime"));
			         		info.putString("deadline",jo.getString("deadline"));
			         		info.putStringArrayList("executer", execList);			         		
			         		info.putString("createTime", jo.getString("createTime"));
			         		info.putInt("state", jo.getInt("state"));
			         		info.putInt("type", jo.getInt("type"));
			         		info.putInt("progress", jo.getInt("progress"));
			         		taskBundleList.add(info);
			         	}
			         	refreshListData();
			         	swipeLayout.setRefreshing(false);
		            	//sessionid = jsonObject.getString("sessionid");*/
		            } catch (JSONException e) {
		            // TODO Auto-generated catch block
		            	e.printStackTrace();
		            }
				}
				
				@Override
				protected void failed(JSONObject jObject){
					super.failed(jObject);
					Toast.makeText(ProjectTaskFragment.this.getActivity(), "获取数据失败", Toast.LENGTH_SHORT).show();
				}
			};
			
			swipeLayout = (SwipeRefreshLayout)inflater.inflate(R.layout.swipe_listview, container,
					false);
			
			swipeLayout.setOnRefreshListener(new OnRefreshListener(){
				@Override
				public void onRefresh() {
					String url = getString(R.string.url_head)+"/API/p/"+projectId+"/s/"+currentSprintId+"/t";
					new HttpConnectionUtils(handler).get(url);
					// TODO Auto-generated method stub
					/*new Handler().postDelayed(new Runnable() {
				        @Override public void run() {
				            swipeLayout.setRefreshing(false);
				        }
				    }, 5000);*/
					
				}
		    	
		    });
		    swipeLayout.setColorScheme(R.color.skyblue ,
		            			R.color.white, 
		            			R.color.skyblue, 
		            			R.color.white);
			
			mListView = (ListView)swipeLayout.findViewById(R.id.swipe_listview);
			mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
	            @Override
	            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
	            	Intent intent = new Intent(getActivity(),TaskActivity.class);
	            	intent.putExtras(taskBundleList.get(position));
	            	getActivity().startActivity(intent);
	            
	            }
	        });
			
			adapter = new SimpleAdapter(
					this.getActivity(),
					list,
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
					});
			mListView.setAdapter(adapter);
			
			
			return swipeLayout;
		}
		
		
		
		@Override
		public void onResume() {
			// TODO Auto-generated method stub
			super.onResume();
			String url = getString(R.string.url_head)+"/API/p/"+projectId+"/s/"+currentSprintId+"/t";
			new HttpConnectionUtils(handler).get(url);
			//refreshListData();
		}


		private void refreshListData(){
			list.clear();
			for(int i=0;i<taskTitleList.size();i++){
				Map<String, Object> map = new HashMap<String, Object>();
				int type = taskTypeList.get(i);
				if(type == 0)
					map.put("task_type_icon", R.drawable.ic_normal);
				if(type == 1)
					map.put("task_type_icon", R.drawable.ic_important);
				if(type == 2)
					map.put("task_type_icon", R.drawable.ic_emergent);
				map.put("task_title_textView", taskTitleList.get(i));
				map.put("task_deadline_textView", "Deadline:" + taskDeadlineList.get(i));
				list.add(map); 
			}
			adapter.notifyDataSetChanged();
		}

	
}
