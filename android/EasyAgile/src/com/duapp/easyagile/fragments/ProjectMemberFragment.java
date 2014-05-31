package com.duapp.easyagile.fragments;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v4.widget.SwipeRefreshLayout.OnRefreshListener;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.Toast;

import com.duapp.easyagile.activities.EntranceActivity;
import com.duapp.easyagile.activities.LoginActivity;
import com.duapp.easyagile.activities.MainActivity;
import com.duapp.easyagile.activities.ProjectActivity;
import com.duapp.easyagile.activities.R;
import com.duapp.easyagile.activities.TaskActivity;
import com.duapp.easyagile.entities.Member;
import com.duapp.easyagile.entities.Members;
import com.duapp.easyagile.entities.Task;
import com.duapp.easyagile.entities.User;
import com.duapp.easyagile.utils.HttpConnectionUtils;
import com.duapp.easyagile.utils.HttpHandler;
import com.duapp.easyagile.utils.JSONTransformationUtils;

public class ProjectMemberFragment extends Fragment{

	private SwipeRefreshLayout swipeLayout;
	private ExpandableListView mExpandableListView;
	private ExpandAdapter adapter;
	
	private String projectId = null;
	
	private List<String> groupList;
	private List<List<Member>> memberList;
	//private List<Bitmap> iconList;
	
	private Handler handler;
	
		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		//private static final String ARG_SECTION_NUMBER = "3";

		/**
		 * Returns a new instance of this fragment for the given userdata.
		 */
		public static ProjectMemberFragment newInstance(Bundle bundle) {
			ProjectMemberFragment fragment = new ProjectMemberFragment();
			fragment.setArguments(bundle);
			return fragment;
		}



		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			handler = new HttpHandler(getActivity()) {		
				//�Լ�����ɹ���Ĳ���
				@Override
				protected void succeed(JSONObject JObject) { 
					super.succeed(JObject);
					groupList.clear();
					memberList.clear();
					JSONObject jsonMembers=new JSONObject();
					try {
						jsonMembers = JObject.getJSONObject("members");
					} catch (JSONException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					
					Members members = JSONTransformationUtils.getMembers(jsonMembers);
					groupList.addAll(members.getGroups());
					memberList.addAll(members.getAllMembersInGroup());
					/*
					JSONArray groups = new JSONArray();
					try {
						groups = jsonMembers.getJSONArray("groups");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					try {
						owner = JSONTransformationUtils.getUser(jsonMembers.getJSONObject("owner"));
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					try {
						for(int i=0;i<groups.length();i++){
							groupList.add(groups.getString(i));
							memberList.add(new ArrayList<Member>());
						}
						
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}	
					
					groupList.add("δ����");
					memberList.add(new ArrayList<Member>());
					
					try {
						JSONArray members = jsonMembers.getJSONArray("members");
						for(int j=0;j<members.length();j++){
							Member member = JSONTransformationUtils.getMember(members.getJSONObject(j));
							for(int k=0;k<groupList.size();k++){
								if(member.getGroup().equals(groupList.get(k))){
									memberList.get(k).add(member);
								}
							}
						}
						
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}	*/
					adapter.notifyDataSetChanged();	
					swipeLayout.setRefreshing(false);
				} 

				@Override
				protected void failed(JSONObject jObject) { 
					super.failed(jObject);
					
					Toast.makeText(getActivity(), "��ȡ����ʧ��", Toast.LENGTH_SHORT).show();
					swipeLayout.setRefreshing(false);
				}
			};
			
			
			projectId = getArguments().getString("projectId");
			
			groupList = new ArrayList<String>();
			memberList = new ArrayList<List<Member>>();
			//iconList = new ArrayList<Bitmap>();
			
			swipeLayout = (SwipeRefreshLayout)inflater.inflate(R.layout.fragment_project_member, container,
					false);
			
			swipeLayout.setOnRefreshListener(new OnRefreshListener(){
				@Override
				public void onRefresh() {
					String url = getString(R.string.url_head)+"/API/p/" + projectId+"/members";
					new HttpConnectionUtils(handler).get(url);
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
			
			mExpandableListView = (ExpandableListView)swipeLayout.findViewById(R.id.expandableListView1);
			/*mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
	            @Override
	            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
	            	Intent intent = new Intent(getActivity(),TaskActivity.class);
	            	intent.putExtras(taskBundleList.get(position));
	            	getActivity().startActivity(intent);
	            
	            }
	        });*/
			
			adapter = new ExpandAdapter(getActivity(),groupList,memberList);
			mExpandableListView.setAdapter(adapter);
			
			String url = getString(R.string.url_head)+"/API/p/" + projectId+"/members";
			new HttpConnectionUtils(handler).get(url);
			
			return swipeLayout;
		}
		
		private class ExpandAdapter extends BaseExpandableListAdapter{

			private Context mContext;
		    private LayoutInflater mInflater = null;
		    private List<String>   mGroupList = null;
		   // private List<Bitmap> mIconList = null;
		    private List<List<Member>>   mMemberList = null;
		    
		    public ExpandAdapter(Context ctx, List<String> groupList
		    		, List<List<Member>> memberList) {
		        mContext = ctx;
		        mInflater = (LayoutInflater) mContext
		                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		        mGroupList = groupList;
		        mMemberList = memberList;
		    }
			
			@Override
			public Member getChild(int groupPosition, int childPosition) {
				// TODO Auto-generated method stub
				return mMemberList.get(groupPosition).get(childPosition);
			}

			@Override
			public long getChildId(int groupPositon, int childPosition) {
				// TODO Auto-generated method stub
				return childPosition;
			}

			@Override
			public View getChildView(int groupPosition, int childPosition, 
					boolean isLastChild, View convertView, ViewGroup parent) {
				// TODO Auto-generated method stub
				if(convertView == null){
					convertView = mInflater.inflate(R.layout.list_item_member, null);
				}
				ChildViewHolder holder = new ChildViewHolder();
		        //holder.mIcon = (ImageView) convertView.findViewById(R.id.member_icon);
		        
		        
		        
		        holder.mChildName = (TextView) convertView.findViewById(R.id.member_name_textView);
		        holder.mPermission = (TextView)convertView.findViewById(R.id.member_permission_textView);
		        holder.mChildName.setText(getChild(groupPosition, childPosition).getName());
		        if(getChild(groupPosition, childPosition).isAdmin()==true)
		        	holder.mPermission.setText("����Ա");
		        else
		        	holder.mPermission.setText("��Ա");
		        return convertView;
			}

			@Override
			public int getChildrenCount(int groupPosition) {
				// TODO Auto-generated method stub
				return mMemberList.get(groupPosition).size();
			}

			@Override
			public List<Member> getGroup(int groupPosition) {
				// TODO Auto-generated method stub
				return mMemberList.get(groupPosition);
			}

			@Override
			public int getGroupCount() {
				// TODO Auto-generated method stub
				return mMemberList.size();
			}

			@Override
			public long getGroupId(int groupPosition) {
				// TODO Auto-generated method stub
				return groupPosition;
			}

			@Override
			public View getGroupView(int groupPosition, boolean isExpanded, 
					View convertView , ViewGroup parent) {
				// TODO Auto-generated method stub
				if (convertView == null) {
		            convertView = mInflater.inflate(R.layout.expandable_list_group_item, null);
		        }
		        GroupViewHolder holder = new GroupViewHolder();
		        holder.mGroupName = (TextView) convertView
		                .findViewById(R.id.groupName_textView);
		        holder.mGroupName.setText(mGroupList.get(groupPosition));
		        holder.mGroupCount = (TextView) convertView
		                .findViewById(R.id.groupCount_textView);
		        holder.mGroupCount.setText("(" + mMemberList.get(groupPosition).size() + ")");
		        return convertView;
			}

			@Override
			public boolean hasStableIds() {
				// TODO Auto-generated method stub
				return false;
			}

			@Override
			public boolean isChildSelectable(int groupPosition, int childPosition) {
				// TODO Auto-generated method stub
				return true;
			}
			
			private class GroupViewHolder {
		        TextView mGroupName;
		        TextView mGroupCount;
		    }

		    private class ChildViewHolder {
		        ImageView mIcon;
		        TextView mChildName;
		        TextView mPermission;
		    }
		};
	
}
