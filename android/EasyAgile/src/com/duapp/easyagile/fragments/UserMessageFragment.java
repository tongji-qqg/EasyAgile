package com.duapp.easyagile.fragments;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.duapp.easyagile.activities.TaskActivity;
import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.R.layout;
import com.duapp.easyagile.activities.R.string;

import android.app.Activity;
import android.content.Intent;
import android.net.ParseException;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class UserMessageFragment extends Fragment {
	
	private ListView mListView;
	
	private Bundle userdata;
	private String username;
	private String userid;
		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		//private static final String ARG_SECTION_NUMBER = "3";

		/**
		 * Returns a new instance of this fragment for the given userdata.
		 */
		public static UserMessageFragment newInstance(Bundle userdata) {
			UserMessageFragment fragment = new UserMessageFragment();
			fragment.setArguments(userdata);
			return fragment;
		}
		
		public UserMessageFragment(){
			
		}


		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			
			
			mListView = (ListView)inflater.inflate(R.layout.fragment_user_project, container,
					false);
			mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
	            @Override
	            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
	            
	            	Intent intent = new Intent(getActivity(),TaskActivity.class);
	            	getActivity().startActivity(intent);
	            
	            }
	        });
			
			mListView.setAdapter(new ArrayAdapter<String>(
					UserMessageFragment.this.getActivity(),
	                android.R.layout.simple_list_item_1,
	                android.R.id.text1,
	                getTaskList()
	                /*new String[]{
							username,
	                        getString(R.string.title_section1),
	                        getString(R.string.title_section2),
	                        getString(R.string.title_section3),
	                }*/));
			
			return mListView;
		}

		@Override
		public void onAttach(Activity activity) {
			super.onAttach(activity);
			((MainActivity) activity).onSectionAttached(
					5);
			userdata = getArguments();
			username = userdata.getString("name");
			userid = userdata.getString("id");
		}
	
	private String[] getTaskList(){
		
		ArrayList<String> taskList = new ArrayList<String>();
		
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet request = new HttpGet(getString(R.string.url_head)+"/API/u/"+userid+"/m");
		HttpResponse response = null;
		String strResult = null;
		
		try{
			response = httpClient.execute(request);			
		}catch (ClientProtocolException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
		
		if(response.getStatusLine().getStatusCode()==200){
			
            try {
                strResult = EntityUtils.toString(response.getEntity());
            } catch (ParseException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
		}
		
		JSONArray jsonArray=null;
		
		 try {
         	jsonArray = new JSONArray(strResult);

         	for(int i=0;i<jsonArray.length();i++){
         		JSONObject jo = jsonArray.getJSONObject(i);
         		taskList.add(jo.getString("message"));
         	}
         	
         } catch (JSONException e) {
         // TODO Auto-generated catch block
         	e.printStackTrace();
         }	 
		 
		 return (String[]) taskList.toArray(new String[taskList.size()]);

	}
}

