package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.ProjectActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;

public class UserProjectFragment extends Fragment {
	
	private ListView mListView;
	private ArrayAdapter<String> adapter;
	private List<String> projectTitleList;
	private List<String> projectIdList;
	private List<String> currentSprintList;
	private Handler handler;
	

		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		//private static final String ARG_SECTION_NUMBER = "3";

		/**
		 * Returns a new instance of this fragment for the given userdata.
		 */
		public static UserProjectFragment newInstance() {
			UserProjectFragment fragment = new UserProjectFragment();
			return fragment;
		}
		
		public UserProjectFragment(){
			projectTitleList = new ArrayList<String>();
			projectIdList = new ArrayList<String>();
			currentSprintList = new ArrayList<String>();
		}


		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			
			String url = getString(R.string.url_head)+"/API/u/projects";
			new HttpConnectionUtils(handler).get(url);
			
			
			mListView = (ListView)inflater.inflate(R.layout.fragment_user_project, container,
					false);
			mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
	            @Override
	            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
	            
	            	Intent intent = new Intent(getActivity(),ProjectActivity.class);
	            	intent.putExtra("projectId", projectIdList.get(position));
	            	intent.putExtra("projectTitle", projectTitleList.get(position));
	            	intent.putExtra("currentSprintId",currentSprintList.get(position));
	            	getActivity().startActivity(intent);
	            
	            }
	        });
			
			adapter = new ArrayAdapter<String>(
					UserProjectFragment.this.getActivity(),
	                android.R.layout.simple_list_item_1,
	                projectTitleList);
			mListView.setAdapter(adapter);
			
			return mListView;
		}

		@Override
		public void onAttach(Activity activity) {
			super.onAttach(activity);
			((MainActivity) activity).onSectionAttached(
					2);

			handler = new HttpHandler(UserProjectFragment.this.getActivity()) {		
				//自己处理成功后的操作
				@Override
				protected void succeed(JSONObject jObject) { 
					super.succeed(jObject);
					
					projectTitleList.clear();
					projectIdList.clear();
					currentSprintList.clear();
					try {
						JSONArray jsonArray = new JSONArray(jObject.getString("projects"));

			         	for(int i=0;i<jsonArray.length();i++){
			         		JSONObject jo = jsonArray.getJSONObject(i);
			         		projectTitleList.add(jo.getString("name"));	
			         		projectIdList.add(jo.getString("_id"));
			         		currentSprintList.add(jo.getJSONObject("cSprint").getString("_id"));
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
					Toast.makeText(UserProjectFragment.this.getActivity(), "获取数据失败", Toast.LENGTH_SHORT).show();
				}
			};
		}
}

