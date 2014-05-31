package com.duapp.easyagile.activities;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v4.widget.SwipeRefreshLayout.OnRefreshListener;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.duapp.easyagile.entities.BitmapWithUrl;
import com.duapp.easyagile.entities.Comment;
import com.duapp.easyagile.entities.Topic;
import com.duapp.easyagile.utils.ActivityStack;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;
import com.duapp.easyagile.utils.ImageFileCache;
import com.duapp.easyagile.utils.ImageMemoryCache;
import com.duapp.easyagile.utils.JSONTransformationUtils;

public class TopicActivity extends Activity{

	private Topic topic;
	private List<Comment> list;
	private List<Bitmap> iconList; 
	
	private String projectId = null;
	private String projectTitle = null;
	private String topicId = null;
	
	private SwipeRefreshLayout swipeLayout;
	private TextView projectNameTextView;
	private TextView topicTitleTextView;
	private ImageView topicAuthorIcon;
	private TextView topicAuthorTextView;
	private TextView topicTimeTextView;
	private TextView topicBodyTextView;
	private EditText commentEditText;
	private Button commentButton;
	private ListView commentListView;
	
	ImageMemoryCache memoryCache;
	ImageFileCache fileCache;
	
	private CommentAdapter adapter;
	
	private Handler getHandler = new HttpHandler(this){
		@Override
		protected void succeed(JSONObject jObject) { 
			super.succeed(jObject);
			
			try {
				JSONObject json = jObject.getJSONObject("topic");

	         	topic = JSONTransformationUtils.getTopic(json);
	         	
	         	//adapter传进去的是一个引用，所以不能直接list=topic.getComments();
	         	list.clear();
	         	list.addAll(topic.getComments());
	         	
	         	//更新界面
	         	topicTitleTextView.setText(topic.getTitle());
	         	topicAuthorTextView.setText(topic.getAuthor().getName());
	         	topicTimeTextView.setText(topic.getDate());
	         	topicBodyTextView.setText(topic.getBody());
	         	
	         	//authorIcon
	         	String url = EntranceActivity.urlHead + "/" + topic.getAuthor().getIconUrl();
	         	if(topic.getAuthor().getIconUrl()!=null){
		        Bitmap icon = memoryCache.getBitmapFromCache(url);
				if(icon == null){
					icon = fileCache.getImage(url);
					if(icon == null){
						HttpConnectionUtils http = new HttpConnectionUtils(authorHandler);
						http.bitmap(url);				
					}else{						
						topicAuthorIcon.setImageBitmap(icon);
					}
				}
	         	}
	         	Utility.setListViewHeightBasedOnChildren(commentListView);
	         	
            } catch (JSONException e) {
            // TODO Auto-generated catch block
            	e.printStackTrace();
            }
			adapter.notifyDataSetChanged();
         	swipeLayout.setRefreshing(false);
		}
		
		@Override
		protected void failed(JSONObject jObject){
			super.failed(jObject);
			Toast.makeText(TopicActivity.this, "获取数据失败", Toast.LENGTH_SHORT).show();
		}
	};
	
	private Handler commentHandler = new HttpHandler(this){
		@Override
		protected void succeed(JSONObject jObject) { 
			super.succeed(jObject);
			commentEditText.setText("");
			refresh();
			Toast.makeText(TopicActivity.this, "评论成功", Toast.LENGTH_SHORT).show();
		}
		
		@Override
		protected void failed(JSONObject jObject){
			super.failed(jObject);
			Toast.makeText(TopicActivity.this, "评论失败", Toast.LENGTH_SHORT).show();
		}
	};
	
	
	private Handler bitmapHandler = new Handler(){
		public void handleMessage(Message message) {
			switch (message.what){
			case HttpConnectionUtils.DID_SUCCEED:
				BitmapWithUrl response = (BitmapWithUrl) message.obj;
				iconList.add(response.getBitmap());
				fileCache.saveBitmap(response.getBitmap(), response.getUrl());
				memoryCache.addBitmapToCache(response.getUrl(), response.getBitmap());
				adapter.notifyDataSetChanged();
				break;
			case HttpConnectionUtils.DID_ERROR: //connection error
				Exception e = (Exception) message.obj;
				e.printStackTrace();
				Toast.makeText(TopicActivity.this, "connection fail,please check connection!",
						Toast.LENGTH_LONG).show();
				break;
			}
			
		}		
	};

	private Handler authorHandler = new Handler(){
		public void handleMessage(Message message) {
			switch (message.what){
			case HttpConnectionUtils.DID_SUCCEED:
				BitmapWithUrl response = (BitmapWithUrl) message.obj;
				fileCache.saveBitmap(response.getBitmap(), response.getUrl());
				memoryCache.addBitmapToCache(response.getUrl(), response.getBitmap());
				topicAuthorIcon.setImageBitmap(response.getBitmap());
				break;
			case HttpConnectionUtils.DID_ERROR: //connection error
				Exception e = (Exception) message.obj;
				e.printStackTrace();
				Toast.makeText(TopicActivity.this, "connection fail,please check connection!",
						Toast.LENGTH_LONG).show();
				break;
			}
			
		}		
	};
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		
		ActivityStack.getInstance().addActivity(this);
		
		setContentView(R.layout.activity_topic);
		
		projectId = getIntent().getStringExtra("projectId");
		projectTitle = getIntent().getStringExtra("projectTitle");
		topicId = getIntent().getStringExtra("topicId");
		
		projectNameTextView = (TextView)findViewById(R.id.topic_projectName_textView);
		topicTitleTextView = (TextView)findViewById(R.id.topic_title_textView);
		topicAuthorIcon = (ImageView)findViewById(R.id.topic_Ac_author_icon);
		topicAuthorTextView = (TextView)findViewById(R.id.topic_Ac_author_textView);
		topicTimeTextView = (TextView)findViewById(R.id.topic_Ac_time_textView);
		topicBodyTextView = (TextView)findViewById(R.id.topic_Ac_body_textView);
		commentEditText = (EditText)findViewById(R.id.topic_comment_editText);
		commentButton = (Button)findViewById(R.id.topic_comment_button);
		commentListView = (ListView)findViewById(R.id.swipe_listview);
		
		topic = new Topic();
		list = new ArrayList<Comment>();
		iconList = new ArrayList<Bitmap>();
		
		memoryCache=new ImageMemoryCache(this);  
		fileCache=new ImageFileCache(); 
		
		projectNameTextView.setText(projectTitle);
		
		swipeLayout = (SwipeRefreshLayout)findViewById(R.id.swipe_container);
		swipeLayout.setOnRefreshListener(new OnRefreshListener(){
			@Override
			public void onRefresh() {
				String url = getString(R.string.url_head) + "/API/p/" + projectId + "/t/" + topicId;
				HttpConnectionUtils http = new HttpConnectionUtils(getHandler);
				http.get(url);
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
		
		adapter = new CommentAdapter(this, list, iconList);		
		commentListView.setAdapter(adapter);		
		commentButton.setOnClickListener(new OnClickListener(){

			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
				if(commentEditText.getText().toString() == ""){
					Toast.makeText(TopicActivity.this, "请输入评论内容", Toast.LENGTH_SHORT).show();
					return;
				}
				List<NameValuePair> params = new ArrayList<NameValuePair>();
				params.add(new BasicNameValuePair("comment",commentEditText.getText().toString()));
				String url = getString(R.string.url_head) + "/API/p/" + projectId + "/tc/" + topicId;
				new HttpConnectionUtils(commentHandler).post(url, params);
			}
			
		});
		
		refresh();
	}

	private void refresh(){
		String url = getString(R.string.url_head) + "/API/p/" + projectId + "/t/" + topicId;
		HttpConnectionUtils http = new HttpConnectionUtils(getHandler);
		http.get(url);
	}
	
	private class CommentAdapter extends BaseAdapter{

		private List<Comment> commentList;
		private List<Bitmap> iconList;
		private LayoutInflater inflater;
		
		
		public CommentAdapter(Context context, List<Comment> list,List<Bitmap> icon){
			commentList = list;
			inflater = LayoutInflater.from(context);
			iconList = icon;
		}
		
		@Override
		public int getCount() {
			// TODO Auto-generated method stub
			return commentList.size();
		}

		@Override
		public Comment getItem(int position) {
			// TODO Auto-generated method stub
			return commentList.get(position);
		}

		@Override
		public long getItemId(int position) {
			// TODO Auto-generated method stub
			return position;
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			// TODO Auto-generated method stub
			ViewHolder viewHolder=null;
			if(convertView == null){
				convertView = inflater.inflate(R.layout.list_item_comment, null);
				viewHolder = new ViewHolder();
				viewHolder.icon = (ImageView)convertView.findViewById(R.id.comment_owner_icon);
				viewHolder.name = (TextView)convertView.findViewById(R.id.comment_owner_textView);
				viewHolder.time = (TextView)convertView.findViewById(R.id.comment_time_textView);
				viewHolder.body = (TextView)convertView.findViewById(R.id.comment_body_textView);
				
				convertView.setTag(viewHolder);
			}else{
				viewHolder = (ViewHolder)convertView.getTag(); 
			}
			viewHolder.name.setText(commentList.get(position).getOwner().getName());
			viewHolder.time.setText(commentList.get(position).getDate());
			viewHolder.body.setText(commentList.get(position).getBody());
			if(iconList.size()>position){
				viewHolder.icon.setImageBitmap(iconList.get(position));
			}
			else{
				 
		        String url = EntranceActivity.urlHead + "/" + commentList.get(position).getOwner().getIconUrl();
		        if(commentList.get(position).getOwner().getIconUrl()!=null){
		        Bitmap icon = memoryCache.getBitmapFromCache(url);
				if(icon == null){
					icon = fileCache.getImage(url);
					if(icon == null){
						HttpConnectionUtils http = new HttpConnectionUtils(bitmapHandler);
						http.bitmap(url);				
					}else{
						iconList.add(icon);
						viewHolder.icon.setImageBitmap(icon);
					}
				}
		        }
			}
			
			
			
			
			return convertView;
		}
		
		private class ViewHolder{
			ImageView icon;
			TextView name;
			TextView time;
			TextView body;
		}
		
	}
	
	public static class Utility {
	    public static void setListViewHeightBasedOnChildren(ListView listView) {
	            //获取ListView对应的Adapter
	        ListAdapter listAdapter = listView.getAdapter(); 
	        if (listAdapter == null) {
	            // pre-condition
	            return;
	        }

	        int totalHeight = 0;
	        for (int i = 0, len = listAdapter.getCount(); i < len; i++) {   //listAdapter.getCount()返回数据项的数目
	            View listItem = listAdapter.getView(i, null, listView);
	            listItem.measure(0, 0);  //计算子项View 的宽高
	            totalHeight += listItem.getMeasuredHeight();  //统计所有子项的总高度
	        }

	        ViewGroup.LayoutParams params = listView.getLayoutParams();
	        params.height = totalHeight + (listView.getDividerHeight() * (listAdapter.getCount() - 1));
	        //listView.getDividerHeight()获取子项间分隔符占用的高度
	        //params.height最后得到整个ListView完整显示需要的高度
	        listView.setLayoutParams(params);
	    }
	}
}
