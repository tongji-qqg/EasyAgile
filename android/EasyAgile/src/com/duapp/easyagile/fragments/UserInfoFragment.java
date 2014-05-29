package com.duapp.easyagile.fragments;


import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.duapp.easyagile.activities.EntranceActivity;
import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.entities.BitmapWithUrl;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.ImageFileCache;
import com.duapp.easyagile.utils.ImageMemoryCache;

public class UserInfoFragment extends Fragment{

	private TextView tvName;
	private TextView tvEmail;
	private ImageView ivIcon;
	private String url=null;
	
	private ImageMemoryCache memoryCache;  
    private ImageFileCache fileCache;
    
    private Handler handler;
    
	public static UserInfoFragment newInstance() {
		UserInfoFragment fragment = new UserInfoFragment();
		return fragment;
	}
	
	@Override
	public void onAttach(Activity activity) {
		// TODO Auto-generated method stub
		super.onAttach(activity);
		((MainActivity) activity).onSectionAttached(1);
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		handler = new Handler() {		
			public void handleMessage(Message message) {
				switch (message.what){
				case HttpConnectionUtils.DID_SUCCEED:
					Bitmap response = ((BitmapWithUrl) message.obj).getBitmap();
					fileCache.saveBitmap(response, url);
					memoryCache.addBitmapToCache(url, response);
					ivIcon.setImageBitmap(response);
					break;
				case HttpConnectionUtils.DID_ERROR: //connection error
					Exception e = (Exception) message.obj;
					e.printStackTrace();
					Toast.makeText(getActivity(), "connection fail,please check connection!",
							Toast.LENGTH_LONG).show();
					break;
				}
				
			}		
		};
		
		
		
		View rootView = inflater.inflate(R.layout.fragment_user_info, container,
				false);
		ivIcon = (ImageView)rootView.findViewById(R.id.user_info_icon);
		memoryCache=new ImageMemoryCache(getActivity());  
        fileCache=new ImageFileCache();  
        url = EntranceActivity.urlHead + "/" + EntranceActivity.userInfo.getIconUrl();
        Bitmap icon = memoryCache.getBitmapFromCache(url);
		if(icon == null){
			icon = fileCache.getImage(url);
			if(icon == null){
				HttpConnectionUtils http = new HttpConnectionUtils(handler);
				http.bitmap(url);				
			}else
				ivIcon.setImageBitmap(icon);
		}
        
		tvName = (TextView)rootView.findViewById(R.id.userInfo_name_textView);
		tvEmail = (TextView)rootView.findViewById(R.id.userInfo_email_textView);
		tvName.setText(EntranceActivity.userInfo.getName());
		tvEmail.setText(EntranceActivity.userInfo.getEmail());
		return rootView;
	}

	
	

	
	

	
}
