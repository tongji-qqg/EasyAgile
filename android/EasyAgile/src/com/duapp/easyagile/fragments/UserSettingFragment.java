package com.duapp.easyagile.fragments;


import com.duapp.easyagile.activities.LoginActivity;
import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.MainActivity.PlaceholderFragment;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

public class UserSettingFragment extends Fragment{

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
		return rootView;
	}

	
	

	
	

	
}
