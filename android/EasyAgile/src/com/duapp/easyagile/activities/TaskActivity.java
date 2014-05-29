package com.duapp.easyagile.activities;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.ListActivity;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.DialogInterface.OnClickListener;
import android.os.Bundle;
import android.os.Handler;
import android.text.InputType;
import android.text.format.Time;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

public class TaskActivity extends Activity{

	private ListView mTaskListView;
	private SimpleAdapter adapter;
	private List<Map<String, Object>> list;
	
	//���ڷ���http����
	String url = null;
	HttpConnectionUtils http;
	List<NameValuePair> params;
	
	//type��state��Ӧ��ʾ���ַ���
	private static final String TYPE_0 = "һ��";
	private static final String TYPE_1 = "��Ҫ";
	private static final String TYPE_2 = "����";
	private static final String STATE_0 = "δ����";
	private static final String STATE_1 = "�����";
	private static final String STATE_2 = "������";
	private static final String STATE_3 = "������";
	private static final String STATE_4 = "������";
	
	//������Ϣ
	private String id = null;	//����APIʱ�á� userȡexecuter�ĵ�һ��	
	private String title = null;
	private String description = null;
	private ArrayList<String> executer;
	private Time startTime = null;
	private Time deadline = null;
	private int type = -1;
	private int progress = -1;
	private int state = -1;
	
	//dialog��Ҫ�õ����������ʱ����
	private EditText etTitle;
	private EditText etDescription;
	private EditText etProgress;
	private int tType = -1;
	private int tState = -1;
	private Time tStartTime;
	private Time tDeadline;
	
	private Handler handler = new HttpHandler(TaskActivity.this) {		
		//�Լ�����ɹ���Ĳ���
		@Override
		protected void succeed(JSONObject jObject) { 
			super.succeed(jObject);
						
			params.clear();
			Toast.makeText(TaskActivity.this, "�޸ĳɹ�", Toast.LENGTH_SHORT).show();
			refreshListData();			
		} 

		@Override
		protected void failed(JSONObject jObject) { 
			super.failed(jObject);
			
			params.clear();
			Toast.makeText(TaskActivity.this, "�޸�ʧ��", Toast.LENGTH_SHORT).show();
		}
	};
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		init();
		setContentView(R.layout.activity_task);
		
		list = new ArrayList<Map<String, Object>>(); 
		mTaskListView = (ListView)findViewById(R.id.task_listView);
        mTaskListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                selectItem(position);
            }
        });
        
        
        //����listView����     set adapter
        adapter = new SimpleAdapter(
                this,
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
        mTaskListView.setAdapter(adapter);
        refreshListData();
	}
	
	//��intent��ȡ��������Ϣ
	private void init(){
		Bundle taskInfo = getIntent().getExtras();
		startTime = new Time();
		deadline = new Time();
		
		id = taskInfo.getString("id");
		title = taskInfo.getString("title");
		description = taskInfo.getString("description");
		executer = taskInfo.getStringArrayList("executer");
		Time tTime = new Time();
		tTime.parse(taskInfo.getString("startTime").replace("-", "").replace(":", "").replace(".000", ""));
		startTime.set(tTime.monthDay, tTime.month, tTime.year);
		tTime.parse(taskInfo.getString("deadline").replace("-", "").replace(":", "").replace(".000", ""));
		deadline.set(tTime.monthDay, tTime.month, tTime.year);
		type = taskInfo.getInt("type");
		state = taskInfo.getInt("state");
		progress = taskInfo.getInt("progress");
	}
	
	//listview ����
	private void refreshListData() {    	       
			list.clear();
		
	    	Map<String, Object> map = new HashMap<String, Object>();	    	    	
	        map.put("task_item_title", "����");  
	        map.put("task_item_content", title);           
	        list.add(map); 

	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "����");  
	        map.put("task_item_content", description);           
	        list.add(map); 
	        
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "��ʼʱ��");  
	        map.put("task_item_content", String.valueOf(startTime.year)
	        		+ "." + String.valueOf(startTime.month+1) 
	        		+ "." + String.valueOf(startTime.monthDay));           
	        list.add(map); 
	        
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "��ֹʱ��");  
	        map.put("task_item_content", String.valueOf(deadline.year)
	        		+ "." + String.valueOf(deadline.month+1) 
	        		+ "." + String.valueOf(deadline.monthDay));           
	        list.add(map); 
	        
	        String strType = null;
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "����");
	        switch(type){
	        case 0:
	        	strType = TYPE_0;
	        	break;
	        case 1:
	        	strType = TYPE_1;
	        	break;
	        case 2:
	        	strType = TYPE_2;
	        	break;
	        }
	        map.put("task_item_content", strType);           
	        list.add(map); 
	    	 
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "����");  
	        map.put("task_item_content", progress);           
	        list.add(map); 
	        
	        String strState = null;
	        map = new HashMap<String, Object>();
	        map.put("task_item_title", "״̬");  
	        switch(state){
	        case 0:
	        	strState = STATE_0;
	        	break;
	        case 1:
	        	strState = STATE_1;
	        	break;
	        case 2:
	        	strState = STATE_2;
	        	break;
	        case 3:
	        	strState = STATE_3;
	        	break;
	        case 4:
	        	strState = STATE_4;
	        	break;
	        }
	        map.put("task_item_content", strState);           
	        list.add(map); 
	        
			adapter.notifyDataSetChanged();
		}

	private void selectItem(int position) {		
		
		url = getString(R.string.url_head)+"/API/u/"+executer.get(0)+"/t/"+id;
		params = new ArrayList<NameValuePair>();
		http = new HttpConnectionUtils(handler);
		
	     switch(position){
	     case 0:
	    	 etTitle = new EditText(this);
	    	 etTitle.setText(title);
	    	 new AlertDialog.Builder(this)
	    	 .setTitle("����")
	    	 .setView(etTitle)
	    	 .setPositiveButton("ȷ��", new OnClickListener(){
				@Override
				public void onClick(DialogInterface dlg, int which) {
					// TODO Auto-generated method stub
					if(etTitle.getText().toString().equals(title) == false){
						dlg.dismiss();
						new AlertDialog.Builder(TaskActivity.this)
				    	 .setTitle("��ʾ")
				    	 .setMessage("ȷ���޸���")
				    	 .setPositiveButton("ȷ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
								// TODO Auto-generated method stub
								confirm.dismiss();								
								title = etTitle.getText().toString();
								params.add(new BasicNameValuePair("title",title));
								http.put(url, params);
							}				    		 
				    	 })
				    	 .setNegativeButton("ȡ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									confirm.dismiss();
								}				    		 
					    	 }).show();
					};
				}
	    	 })
	    	 .setNegativeButton("ȡ��", new OnClickListener(){
					@Override
					public void onClick(DialogInterface dlg, int arg1) {
							// TODO Auto-generated method stub
							dlg.dismiss();
						}				    		 
			    	 }).show();
	    	 break;
	     case 1:
	    	 etDescription = new EditText(this);
	    	 etDescription.setText(description);
	    	 new AlertDialog.Builder(this)
	    	 .setTitle("����")
	    	 .setView(etDescription)
	    	 .setPositiveButton("ȷ��", new OnClickListener(){
				@Override
				public void onClick(DialogInterface dlg, int which) {
					// TODO Auto-generated method stub
					if(etDescription.getText().toString().equals(description) == false){
						dlg.dismiss();
						new AlertDialog.Builder(TaskActivity.this)
				    	 .setTitle("��ʾ")
				    	 .setMessage("ȷ���޸���")
				    	 .setPositiveButton("ȷ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
								// TODO Auto-generated method stub
								confirm.dismiss();
								description = etDescription.getText().toString();
								params.add(new BasicNameValuePair("description",description));
								http.put(url, params);
								
							}				    		 
				    	 })
				    	 .setNegativeButton("ȡ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									confirm.dismiss();
								}				    		 
					    	 }).show();
					};
				}
	    	 })
	    	 .setNegativeButton("ȡ��", new OnClickListener(){
					@Override
					public void onClick(DialogInterface dlg, int arg1) {
							// TODO Auto-generated method stub
							dlg.dismiss();
						}				    		 
			    	 }).show();
	    	 break;
	     case 2:
	    	 new DatePickerDialog(this,
	    			new DatePickerDialog.OnDateSetListener() { 
	    	        @Override 
	    	        public void onDateSet(DatePicker datePicker,  
	    	                int year, int month, int dayOfMonth) {
	    	        	tStartTime = new Time();
	    	        	tStartTime.set(dayOfMonth, month, year);
	    	        	if(tStartTime.after(deadline)){
	    	        		Toast.makeText(getApplicationContext(), "�������ڽ�ֹ����", Toast.LENGTH_SHORT).show();
	    	        		return;
	    	        	}
	    	        	if(Time.compare(tStartTime, startTime) != 0){
	    	        		new AlertDialog.Builder(TaskActivity.this)
					    	 .setTitle("��ʾ")
					    	 .setMessage("ȷ���޸���")
					    	 .setPositiveButton("ȷ��", new OnClickListener(){
								@Override
								public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									startTime = tStartTime;
									String time = String.valueOf(startTime.year) 
											+ "-" + String.valueOf(startTime.month+1)
											+ "-" + String.valueOf(startTime.monthDay+1); 
									params.add(new BasicNameValuePair("startTime",time));
									http.put(url, params);
								}
							})
							.setNegativeButton("ȡ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									confirm.dismiss();
								}				    		 
					    	 }).show();
	    	        	}
	    	        }},
	    	        startTime.year,
    	            startTime.month,
    	            startTime.monthDay
	    			).show();
	    	 break;
	     case 3:
	    	 new DatePickerDialog(this,
	    			new DatePickerDialog.OnDateSetListener() { 
	    	        @Override 
	    	        public void onDateSet(DatePicker datePicker,  
	    	                int year, int month, int dayOfMonth) { 
	    	        	tDeadline = new Time();
	    	        	tDeadline.set(dayOfMonth, month, year);
	    	        	if(tDeadline.before(startTime)){
	    	        		Toast.makeText(getApplicationContext(), "�������ڿ�ʼ����", Toast.LENGTH_SHORT).show();
	    	        		return;
	    	        	}
	    	        	if(Time.compare(tDeadline, deadline) != 0){
	    	        		new AlertDialog.Builder(TaskActivity.this)
					    	 .setTitle("��ʾ")
					    	 .setMessage("ȷ���޸���")
					    	 .setPositiveButton("ȷ��", new OnClickListener(){
								@Override
								public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									deadline = tDeadline;
									String time = String.valueOf(deadline.year) 
											+ "-" + String.valueOf(deadline.month+1)
											+ "-" + String.valueOf(deadline.monthDay +1); 
									params.add(new BasicNameValuePair("deadline",time));
									http.put(url, params);
								}
							})
							.setNegativeButton("ȡ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									confirm.dismiss();
								}				    		 
					    	 }).show();
	    	        	}
	    	        	
	    	        	
	    	        }},
	    	        deadline.year,
    	            deadline.month,
    	            deadline.monthDay
	    			).show();
	    	 break;
	     case 4:
	    	 new AlertDialog.Builder(this)
	    	 	.setTitle("����")
	    	 	.setSingleChoiceItems(
	    		     new String[] { TYPE_0, TYPE_1, TYPE_2 }, type,
	    		     new DialogInterface.OnClickListener() {
	    		      public void onClick(DialogInterface dialog, int which) {
	    		    	  if(type != which){
	    		    		  dialog.dismiss();
	    		    		  tType = which;
	  						new AlertDialog.Builder(TaskActivity.this)
	  				    	 .setTitle("��ʾ")
	  				    	 .setMessage("ȷ���޸���")
	  				    	 .setPositiveButton("ȷ��", new OnClickListener(){
	  							@Override
	  							public void onClick(DialogInterface confirm, int arg1) {
	  								// TODO Auto-generated method stub
	  								confirm.dismiss();
	  								type = tType;
	  								params.add(new BasicNameValuePair("type",String.valueOf(type)));
									http.put(url, params);
	  							}				    		 
	  				    	 })
	  				    	 .setNegativeButton("ȡ��", new OnClickListener(){
	  							@Override
	  							public void onClick(DialogInterface confirm, int arg1) {
	  									// TODO Auto-generated method stub
	  									confirm.dismiss();
	  								}				    		 
	  					    	 }).show();
	    		    	  }	    		       
	    		      }
	    		     })
	    		     .setNegativeButton("ȡ��", null).show();
	    	 break;
	     case 5:
	    	 etProgress = new EditText(this);
	    	 etProgress.setInputType(InputType.TYPE_CLASS_NUMBER);
	    	 etProgress.setText(String.valueOf(progress));
	    	 new AlertDialog.Builder(this)
	    	 .setTitle("����")
	    	 .setView(etProgress)
	    	 .setPositiveButton("ȷ��", new OnClickListener(){
				@Override
				public void onClick(DialogInterface dlg, int which) {
					// TODO Auto-generated method stub
					if(Integer.parseInt(etProgress.getText().toString()) != progress){
						dlg.dismiss();
						new AlertDialog.Builder(TaskActivity.this)
				    	 .setTitle("��ʾ")
				    	 .setMessage("ȷ���޸���")
				    	 .setPositiveButton("ȷ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
								// TODO Auto-generated method stub
								int p = Integer.parseInt(etProgress.getText().toString());
								if(p > 100 || p < 0){
									Toast.makeText(getApplicationContext(), "����ȡֵ��Χ0-100", Toast.LENGTH_SHORT).show();
			    	        		return;
								}
								confirm.dismiss();
								progress = p;
								params.add(new BasicNameValuePair("progress",String.valueOf(progress)));
								http.put(url, params);
							}				    		 
				    	 })
				    	 .setNegativeButton("ȡ��", new OnClickListener(){
							@Override
							public void onClick(DialogInterface confirm, int arg1) {
									// TODO Auto-generated method stub
									confirm.dismiss();
								}				    		 
					    	 }).show();
					};
				}
	    	 })
	    	 .setNegativeButton("ȡ��", new OnClickListener(){
					@Override
					public void onClick(DialogInterface dlg, int arg1) {
							// TODO Auto-generated method stub
							dlg.dismiss();
						}				    		 
			    	 }).show();
	    	 break;
	     case 6:
	    	 new AlertDialog.Builder(this)
	    	 	.setTitle("״̬")
	    	 	.setSingleChoiceItems(
	    		     new String[] { STATE_0, STATE_1, STATE_2, STATE_3, STATE_4}, state,
	    		     new DialogInterface.OnClickListener() {
	    		      public void onClick(DialogInterface dialog, int which) {
	    		    	  if(state != which){
	    		    		  dialog.dismiss();
	    		    		  tState = which;
	  						new AlertDialog.Builder(TaskActivity.this)
	  				    	 .setTitle("��ʾ")
	  				    	 .setMessage("ȷ���޸���")
	  				    	 .setPositiveButton("ȷ��", new OnClickListener(){
	  							@Override
	  							public void onClick(DialogInterface confirm, int arg1) {
	  								// TODO Auto-generated method stub
	  								confirm.dismiss();
	  								state = tState;
	  								params.add(new BasicNameValuePair("state",String.valueOf(state)));
									http.put(url, params);
	  							}				    		 
	  				    	 })
	  				    	 .setNegativeButton("ȡ��", new OnClickListener(){
	  							@Override
	  							public void onClick(DialogInterface confirm, int arg1) {
	  									// TODO Auto-generated method stub
	  									confirm.dismiss();
	  								}				    		 
	  					    	 }).show();
	    		    	  }	    		       
	    		      }
	    		     })
	    		     .setNegativeButton("ȡ��", null).show();
	    	 break;
	     }
	    }
}
