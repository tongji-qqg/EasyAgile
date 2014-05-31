package com.duapp.easyagile.activities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.duapp.easyagile.entities.User;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;
import com.duapp.easyagile.utils.JSONTransformationUtils;


public class LoginActivity extends Activity{
	
	
	
	private EditText etEmail = null;
	private EditText etPassword = null;
	private Button btnLogin = null;
	
	
	private HashMap<String, String> session =new HashMap<String, String>();


	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.setContentView(R.layout.activity_login);
		
	/*	//主线程中强制发送http请求——strictMode，不推荐。
		if (android.os.Build.VERSION.SDK_INT > 9) {
		    StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
		    StrictMode.setThreadPolicy(policy);
		}*/
		
		
		etEmail = (EditText)super.findViewById(R.id.login_username);
		etPassword = (EditText)super.findViewById(R.id.login_password);
		btnLogin = (Button)super.findViewById(R.id.button_login);
		
		btnLogin.setOnClickListener(new LoginListener());
	}

	//检查输入规范
	private boolean checkEdit() {
		if(etEmail.getText().toString().trim().equals("")){
            Toast.makeText(this, "邮箱不能为空", Toast.LENGTH_SHORT).show();
            return false;
        }
		else if(etPassword.getText().toString().trim().equals("")){
            Toast.makeText(this, "密码不能为空", Toast.LENGTH_SHORT).show();
            return false;
        }
		else
            return true;
      
	}	
	
	//用户登录验证
	private void login() {
		// 
		String email = etEmail.getText().toString();
		String password = etPassword.getText().toString();
		String url = getString(R.string.url_head) + "/API/u";
		
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("emailaddress",email));
		params.add(new BasicNameValuePair("password",password));
		
		new HttpConnectionUtils(handler).post(url, params);
		
                                          
	}

	private Handler handler = new HttpHandler(LoginActivity.this) {		
		//自己处理成功后的操作
		@Override
		protected void succeed(JSONObject jObject) { 
			super.succeed(jObject);
			
			try {
				User user = JSONTransformationUtils.getUser(jObject.getJSONObject("user"));

            	EntranceActivity.userInfo = user;
            	
            	
            	//sessionid = jsonObject.getString("sessionid");*/
            } catch (JSONException e) {
            // TODO Auto-generated catch block
            	e.printStackTrace();
            }
			
			SharedPreferences preferences = getSharedPreferences("user",Context.MODE_PRIVATE);
			Editor editor=preferences.edit();
			editor.putString("email", EntranceActivity.userInfo.getEmail());
			editor.putString("password", etPassword.getText().toString());
			editor.commit();
			
			
			Toast.makeText(LoginActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
			Intent intent = new Intent(LoginActivity.this, MainActivity.class);
			startActivity(intent);
			LoginActivity.this.finish();
			
		} 

		@Override
		protected void failed(JSONObject jObject) { 
			super.failed(jObject);
			Toast.makeText(LoginActivity.this, "用户验证失败", Toast.LENGTH_SHORT).show();
		}
	};
	
	
	//登录按钮监听
	private class LoginListener implements OnClickListener{

		@Override
		public void onClick(View view) {
			// TODO Auto-generated method stub
			if(!checkEdit())
				return;

			login();
		}
	}


}
