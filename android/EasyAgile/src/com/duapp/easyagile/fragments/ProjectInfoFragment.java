package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v4.widget.SwipeRefreshLayout.OnRefreshListener;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import com.duapp.easyagile.activities.ProjectActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;


public class ProjectInfoFragment	extends Fragment {
	
	private ListView mListView;
	private SwipeRefreshLayout swipeLayout;
	
	private SimpleAdapter adapter;	
	private List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
	private HttpHandler handler; 
	
	private String projectId = null;
	private String name = null;
	private String description = null;
	private String createTime;
	private String currentSprintName = null;
	private String currentSprintId = null;
	private Boolean done;
	
		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		//private static final String ARG_SECTION_NUMBER = "3";

		/**
		 * Returns a new instance of this fragment for the given userdata.
		 */
		public static ProjectInfoFragment newInstance(Bundle bundle) {
			ProjectInfoFragment fragment = new ProjectInfoFragment();
			fragment.setArguments(bundle);
			return fragment;
		}
		
		public ProjectInfoFragment(){

		}


		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			
			projectId = this.getArguments().getString("projectId");

			handler = new HttpHandler(this.getActivity()) {		
				//自己处理成功后的操作
				@Override
				protected void succeed(JSONObject jObject) { 
					super.succeed(jObject);
					
					try {
						JSONObject info = jObject.getJSONObject("project");				
						name = info.getString("name");
						description = info.getString("description");
						createTime = info.getString("createTime");
						done = info.getBoolean("done");
						//currentSprintName = info.getJSONObject("cSprint").getString("name");
						currentSprintId = info.getString("cSprint");

						
		            } catch (JSONException e) {
		            // TODO Auto-generated catch block
		            	e.printStackTrace();
		            }
					refreshList();
					swipeLayout.setRefreshing(false);
				}		
				@Override
				protected void failed(JSONObject jObject){
					super.failed(jObject);
					Toast.makeText(ProjectInfoFragment.this.getActivity(), "获取数据失败", Toast.LENGTH_SHORT).show();
				}
			};
			
			String url = getString(R.string.url_head)+"/API/p/"+projectId;
			new HttpConnectionUtils(handler).get(url);
			
			swipeLayout = (SwipeRefreshLayout)inflater.inflate(R.layout.swipe_listview, container,
					false);
			
			swipeLayout.setOnRefreshListener(new OnRefreshListener(){
				@Override
				public void onRefresh() {
					String url = getString(R.string.url_head)+"/API/p/"+projectId;
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
			
			//设置listView布局     set adapter
	        adapter = new SimpleAdapter(
	                this.getActivity(),
	                list,
	                R.layout.list_item_task_info,
	                new String[]{
	                        "task_item_title",
	                        "task_item_content"
	                },
	                new int[]{
	                	R.id.task_item_title,
	                	R.id.task_item_content
	                });
	        mListView.setAdapter(adapter);
			
	        
	        
			return swipeLayout;
		}
	
		private void refreshList(){
			list.clear();
			
			Map<String, Object> map = new HashMap<String, Object>();	    	    	
	        map.put("task_item_title", "项目名称");  
	        map.put("task_item_content", name);           
	        list.add(map);
	        
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "描述");  
	        map.put("task_item_content", description);           
	        list.add(map);
	        
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "创建时间");  
	        map.put("task_item_content", createTime.substring(0, 19).replace("T", " "));           
	        list.add(map);
	        
	        /*map = new HashMap<String, Object>();
	        map.put("task_item_title", "当前Sprint");  
	        map.put("task_item_content", currentSprintName);           
	        list.add(map);*/
	        
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "状态");
	        String state;
	        if (done == true) 
				state = "已完成";
	        else
	        	state = "未完成";
	        map.put("task_item_content", state);           
	        list.add(map);
	        
	        adapter.notifyDataSetChanged();
		}
		
		
		
}
