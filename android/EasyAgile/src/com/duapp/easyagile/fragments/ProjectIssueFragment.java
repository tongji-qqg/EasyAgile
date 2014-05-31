package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.entities.Issue;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;
import com.duapp.easyagile.utils.JSONTransformationUtils;

import android.content.Context;
import android.graphics.Paint;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v4.widget.SwipeRefreshLayout.OnRefreshListener;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.Toast;

public class ProjectIssueFragment extends Fragment implements OnClickListener{
	
	private ListView mListView;
	private SwipeRefreshLayout swipeLayout;
	private SimpleAdapter adapter;
	
	private String projectId = null;
	private Handler getHandler;
	private Handler putHandler;
	
	private List<Map<String, Object>> list;
	private List<Issue> issueList;
	/*private List<String> issueIdList;
	private List<String> issueFinderList;
	private List<String> issueDescriptionList;
	private List<String> issueDiscoverTimeList;
	private List<Boolean> isSolvedList;*/

	public static ProjectIssueFragment newInstance(Bundle bundle) {
		ProjectIssueFragment fragment = new ProjectIssueFragment();
		fragment.setArguments(bundle);
		return fragment;
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		
		list = new ArrayList<Map<String, Object>>(); 
		issueList = new ArrayList<Issue>();
		/*issueIdList = new ArrayList<String>();
		issueFinderList = new ArrayList<String>();
		issueDescriptionList = new ArrayList<String>();
		issueDiscoverTimeList = new ArrayList<String>();
		isSolvedList = new ArrayList<Boolean>();*/
		
		projectId = this.getArguments().getString("projectId");
		
		getHandler = new HttpHandler(ProjectIssueFragment.this.getActivity()) {		
			//自己处理成功后的操作
			@Override
			protected void succeed(JSONObject jObject) { 
				super.succeed(jObject);
				
				issueList.clear();
				/*issueIdList.clear();
				issueFinderList.clear();
				issueDescriptionList.clear();
				issueDiscoverTimeList.clear();
				isSolvedList.clear();*/
				try {
					JSONArray jsonArray = new JSONArray(jObject.getString("issues"));

		         	for(int i=0;i<jsonArray.length();i++){
		         		JSONObject jo = jsonArray.getJSONObject(i);
		         		/*Boolean solved = jo.getBoolean("solved");
		         		//if(solved == false){
		         			issueIdList.add(jo.getString("_id"));
		         			issueFinderList.add(jo.getJSONObject("finder").getString("name"));
		         			issueDescriptionList.add(jo.getString("description"));
		         			issueDiscoverTimeList.add(jo.getString("discoverTime").substring(0, 19).replace("T", " "));
		         			isSolvedList.add(jo.getBoolean("solved"));
		         		//}*/
		         		
		         		issueList.add(JSONTransformationUtils.getIssue(jo));
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
				Toast.makeText(ProjectIssueFragment.this.getActivity(), "获取数据失败", Toast.LENGTH_SHORT).show();
			}
		};
		
		putHandler = new HttpHandler(ProjectIssueFragment.this.getActivity()) {		
			//自己处理成功后的操作
			@Override
			protected void succeed(JSONObject jObject) { 
				super.succeed(jObject);
				adapter.notifyDataSetChanged();
				Toast.makeText(ProjectIssueFragment.this.getActivity(), "设置成功", Toast.LENGTH_SHORT).show();
			}
			
			@Override
			protected void failed(JSONObject jObject){
				super.failed(jObject);
				Toast.makeText(ProjectIssueFragment.this.getActivity(), "设置失败", Toast.LENGTH_SHORT).show();
			}
		};
		
		String url = getString(R.string.url_head)+"/API/p/"+projectId+"/i";
		new HttpConnectionUtils(getHandler).get(url);
		
		swipeLayout = (SwipeRefreshLayout)inflater.inflate(R.layout.swipe_listview, container,
				false);
		
		swipeLayout.setOnRefreshListener(new OnRefreshListener(){
			@Override
			public void onRefresh() {
				String url = getString(R.string.url_head)+"/API/p/"+projectId+"/i";
				new HttpConnectionUtils(getHandler).get(url);
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
		
		adapter = new SimpleCheckableAdapter(
                this.getActivity(),
                list,
                R.layout.list_item_issue,
                new String[]{
                		"issue_solved_checkBox",
                        "issue_description_textView",
                        "issue_timeWithFinder_textView",
                },
                new int[]{
                	R.id.issue_solved_checkBox,
                	R.id.issue_description_textView,
                	R.id.issue_timeWithFinder_textView,
                });
		mListView.setAdapter(adapter);
		
		return swipeLayout;
	}

	@Override
	public void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
	}
	
	private void refreshListData(){
		list.clear();
		for(int i=0;i<issueList.size();i++){
			Map<String, Object> map = new HashMap<String, Object>();
			Issue issue = issueList.get(i);
			map.put("issue_solved_checkBox", issue.isSolved()); 
			map.put("issue_description_textView", issue.getDescription());
			map.put("issue_timeWithFinder_textView", 
						issue.getDiscoverTime()+", "+issue.getFinder().getName());
			list.add(map); 
		}
		adapter.notifyDataSetChanged();
	}

	
	private class SimpleCheckableAdapter extends SimpleAdapter {
		  
        public SimpleCheckableAdapter(Context context,
				List<? extends Map<String, ?>> data, int resource,
				String[] from, int[] to) {
			super(context, data, resource, from, to);
			// TODO Auto-generated constructor stub
		}

        
        
		@Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view =  super.getView(position, convertView, parent);
            if(view!=null) {
            	TextView tv = (TextView) view.findViewById(R.id.issue_description_textView);
                CheckBox cb = (CheckBox) view.findViewById(R.id.issue_solved_checkBox);
                //  tag 为它所在的行，在onClick方法里面用到
                
                if(issueList.get(position).isSolved()){
                	cb.setChecked(true);
                	tv.getPaint().setFlags(Paint.STRIKE_THRU_TEXT_FLAG);
                }
                else{
                	cb.setChecked(false);
                	tv.getPaint().setFlags(0);
                }
                 
                cb.setTag(position);
                cb.setOnClickListener(ProjectIssueFragment.this);
            }
            return view;
        }          
    }
	
	
	/*@Override
	public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
		// TODO Auto-generated method stub
		int row = (Integer) buttonView.getTag();
		
		String url = getString(R.string.url_head)+"/API/p/"+projectId+"/i/"+issueList.get(row).get_id();
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("solved",String.valueOf(isChecked)));
		new HttpConnectionUtils(putHandler).put(url,params);
		//TextView solved = (TextView)ProjectIssueFragment.this.getActivity().findViewById(R.id.issue_description_textView);
		//solved.setTag(row);
		//solved.getPaint().setFlags(Paint.STRIKE_THRU_TEXT_FLAG);
		adapter.notifyDataSetChanged();
	}*/

	@Override
	public void onClick(View view) {
		// TODO Auto-generated method stub

		int position = (Integer)view.getTag();
		boolean solved = ((CheckBox)view).isChecked();
		issueList.get(position).setSolved(solved);
		
		String url = getString(R.string.url_head)+"/API/p/"+projectId+"/i/"+issueList.get(position).get_id();
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("solved",String.valueOf(solved)));
		new HttpConnectionUtils(putHandler).put(url,params);
				
	}
}
