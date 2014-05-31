package com.duapp.easyagile.activities;


import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.widget.Toast;

import com.duapp.easyagile.entities.User;
import com.duapp.easyagile.utils.ActivityStack;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.JSONTransformationUtils;

public class EntranceActivity extends ActionBarActivity{

	/*public static String username = null;
	public static String userId = null;
	public static String email = null;*/
	public static String urlHead = null;
	public static User userInfo;
	
	private String password = null;
	
	private ActionBar mActionBar;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		
		ActivityStack.getInstance().addActivity(this);
		
		mActionBar = getSupportActionBar();
		mActionBar.hide();
		setContentView(R.layout.activity_entrance);
		
		urlHead = getString(R.string.url_head);
		
		SharedPreferences preferences=getSharedPreferences("user",Context.MODE_PRIVATE);
		String email = preferences.getString("email",null);
		if(email == null){
			Intent intent = new Intent(EntranceActivity.this, LoginActivity.class);			
			startActivity(intent);
			ActivityStack.getInstance().logout();
		}
		else if(HttpConnectionUtils.SESSIONID != null){   
			Intent intent = new Intent(EntranceActivity.this, MainActivity.class);			
			startActivity(intent);
			ActivityStack.getInstance().logout();
		}
		else{
			password = preferences.getString("password",null);
		
			String url = getString(R.string.url_head) + "/API/u";
		
			List<NameValuePair> params = new ArrayList<NameValuePair>();
			params.add(new BasicNameValuePair("emailaddress",email));
			params.add(new BasicNameValuePair("password",password));
		
			new HttpConnectionUtils(handler).post(url, params);	
		}
				
	}
	
	Handler handler = new Handler(){
		public void handleMessage(Message message) {
			switch (message.what){
			case HttpConnectionUtils.DID_SUCCEED:
				String response = (String) message.obj;
				try {
					JSONObject jObject = new JSONObject(response == null ? ""
							: response.trim());
					if ("success".equals(jObject.getString("state"))) { //operate success
						//Toast.makeText(context, "operate succeed",Toast.LENGTH_SHORT).show();
						userInfo = JSONTransformationUtils.getUser(jObject.getJSONObject("user"));
						Intent intent = new Intent(EntranceActivity.this, MainActivity.class);
						startActivity(intent);
						ActivityStack.getInstance().logout();
					} else {
						//Toast.makeText(context, "operate fialed",Toast.LENGTH_LONG).show();
						Toast.makeText(EntranceActivity.this, "saved info error",
								Toast.LENGTH_LONG).show();
						Intent intent = new Intent(EntranceActivity.this, LoginActivity.class);			
						startActivity(intent);
						ActivityStack.getInstance().logout();
					}
				} catch (JSONException e1) {
					e1.printStackTrace();
					Toast.makeText(EntranceActivity.this, "json error!",
							Toast.LENGTH_LONG).show();
					Intent intent = new Intent(EntranceActivity.this, LoginActivity.class);			
					startActivity(intent);
					ActivityStack.getInstance().logout();
				}
				break;
			case HttpConnectionUtils.DID_ERROR: //connection error
				Exception e = (Exception) message.obj;
				e.printStackTrace();
				Toast.makeText(EntranceActivity.this, "connection fail,please check connection!",
						Toast.LENGTH_LONG).show();
				break;
			}
			
		}
	};

	
}
