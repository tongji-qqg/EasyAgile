package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.TaskActivity;
import com.duapp.easyagile.activities.TopicActivity;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;

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

public class ProjectTopicFragment extends Fragment{
	
	private ListView mListView;
	private SwipeRefreshLayout swipeLayout;
	private SimpleAdapter adapter;
	
	private String projectId = null;
	private String projectTitle = null;
	private List<Map<String, Object>> list;
	private List<String> topicIdList;
	private List<String> topicAuthorList;
	private List<String> topicTitleList;
	private List<String> topicTimeList;
	
	private Handler handler;
	
	public static ProjectTopicFragment newInstance(Bundle bundle) {
		ProjectTopicFragment fragment = new ProjectTopicFragment();
		fragment.setArguments(bundle);
		return fragment;
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		list = new ArrayList<Map<String, Object>>(); 
		topicAuthorList = new ArrayList<String>();
		topicTitleList = new ArrayList<String>();
		topicTimeList = new ArrayList<String>();
		topicIdList = new ArrayList<String>();
		
		projectId = this.getArguments().getString("projectId");
		projectTitle = this.getArguments().getString("projectTitle");
		
		handler = new HttpHandler(ProjectTopicFragment.this.getActivity()) {		
			//自己处理成功后的操作
			@Override
			protected void succeed(JSONObject jObject) { 
				super.succeed(jObject);
				
				topicIdList.clear();
				topicAuthorList.clear();
				topicTitleList.clear();
				topicTimeList.clear();
				try {
					JSONArray jsonArray = new JSONArray(jObject.getString("topics"));

		         	for(int i=0;i<jsonArray.length();i++){
		         		JSONObject jo = jsonArray.getJSONObject(i);
		         		
		         		ArrayList<String> execList = new ArrayList<String>();
		         		Bundle info = new Bundle();
		         		
		         		topicIdList.add(jo.getString("_id"));
		         		topicTitleList.add(jo.getString("title"));
		         		topicAuthorList.add(jo.getJSONObject("author").getString("name"));
		         		topicTimeList.add(jo.getString("date").substring(0, 19).replace("T", " "));
		         	
		         		
		         	}
	            	//sessionid = jsonObject.getString("sessionid");*/
	            } catch (JSONException e) {
	            // TODO Auto-generated catch block
	            	e.printStackTrace();
	            }
				refreshListData();
				swipeLayout.setRefreshing(false);
			}
			
			@Override
			protected void failed(JSONObject jObject){
				super.failed(jObject);
				Toast.makeText(ProjectTopicFragment.this.getActivity(), "获取数据失败", Toast.LENGTH_SHORT).show();
			}
		};
		
		String url = getString(R.string.url_head)+"/API/p/"+projectId+"/t";
		new HttpConnectionUtils(handler).get(url);
		
		swipeLayout = (SwipeRefreshLayout)inflater.inflate(R.layout.swipe_listview, container,
				false);
		
		swipeLayout.setOnRefreshListener(new OnRefreshListener(){
			@Override
			public void onRefresh() {
				String url = getString(R.string.url_head)+"/API/p/"+projectId+"/t";
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
            	Intent intent = new Intent(getActivity(),TopicActivity.class);
            	intent.putExtra("projectId",projectId);
            	intent.putExtra("projectTitle", projectTitle);
            	intent.putExtra("topicId", topicIdList.get(position));
            	getActivity().startActivity(intent);
            
            }
        });
		
		adapter = new SimpleAdapter(
                this.getActivity(),
                list,
                R.layout.list_item_topic,
                new String[]{
                		"topic_author_icon",
                        "topic_author_textView",
                        "topic_title_textView",
                        "topic_time_textView"
                },
                new int[]{
                	R.id.topic_author_icon,
                	R.id.topic_author_textView,
                	R.id.member_name_textView,
                	R.id.member_permission_textView
                });
		mListView.setAdapter(adapter);
		
		return swipeLayout;
	}
	
	private void refreshListData(){
		list.clear();
		for(int i=0;i<topicIdList.size();i++){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("topic_author_icon", R.drawable.ic_launcher); 
			map.put("topic_author_textView", topicAuthorList.get(i));  
			map.put("topic_title_textView", topicTitleList.get(i));
			map.put("topic_time_textView", topicTimeList.get(i));
			list.add(map); 
		}
		adapter.notifyDataSetChanged();
	}
	
}
