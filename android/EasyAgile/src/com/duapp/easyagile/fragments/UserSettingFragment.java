package com.duapp.easyagile.fragments;


import org.apache.http.message.BasicNameValuePair;

import com.duapp.easyagile.activities.EntranceActivity;
import com.duapp.easyagile.activities.LoginActivity;
import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.TaskActivity;
import com.duapp.easyagile.activities.MainActivity.PlaceholderFragment;
import com.duapp.easyagile.utils.ActivityStack;
import com.duapp.easyagile.utils.HttpConnectionUtils;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.content.DialogInterface.OnClickListener;
import android.content.SharedPreferences.Editor;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

public class UserSettingFragment extends Fragment{

	private Button btLogout;
	
	public static UserSettingFragment newInstance() {
		UserSettingFragment fragment = new UserSettingFragment();
		return fragment;
	}
	
	@Override
	public void onAttach(Activity activity) {
		// TODO Auto-generated method stub
		super.onAttach(activity);
		((MainActivity) activity).onSectionAttached(5);
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		View rootView = inflater.inflate(R.layout.fragment_user_setting, container,
				false);
		
		btLogout = (Button)rootView.findViewById(R.id.buttonLogout);
		
		btLogout.setOnClickListener(new android.view.View.OnClickListener(){

			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
				new AlertDialog.Builder(getActivity())
		    	 .setTitle("提示")
		    	 .setMessage("确认退出登录吗？")
		    	 .setPositiveButton("确定", new OnClickListener(){
					@Override
					public void onClick(DialogInterface confirm, int arg1) {
						// TODO Auto-generated method stub
						SharedPreferences sp = getActivity()
								.getSharedPreferences("user",Context.MODE_PRIVATE);
						Editor editor=sp.edit();
						editor.remove("email");
						editor.remove("password");
						editor.commit();
						HttpConnectionUtils.SESSIONID = null;
						Intent intent = new Intent(getActivity(),EntranceActivity.class);
						startActivity(intent);
						ActivityStack.getInstance().logout();
					}

				})
				.setNegativeButton("取消", new OnClickListener(){
				@Override
				public void onClick(DialogInterface confirm, int arg1) {
						// TODO Auto-generated method stub
						confirm.dismiss();
					}				    		 
		    	 }).show();
			}
			
		});
		
		return rootView;
	}

	
	

	
	

	
}
