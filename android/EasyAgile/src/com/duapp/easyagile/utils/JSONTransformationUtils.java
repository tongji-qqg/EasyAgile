package com.duapp.easyagile.utils;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.duapp.easyagile.activities.EntranceActivity;
import com.duapp.easyagile.entities.Comment;
import com.duapp.easyagile.entities.Issue;
import com.duapp.easyagile.entities.Member;
import com.duapp.easyagile.entities.Task;
import com.duapp.easyagile.entities.Topic;
import com.duapp.easyagile.entities.User;

public class JSONTransformationUtils {

	public static User getUser(JSONObject json){
		User user = new User();
		
		try{
		user.set_id(json.getString("_id"));
		user.setName(json.getString("name"));		
		}catch (JSONException e) {
            // TODO Auto-generated catch block
        	e.printStackTrace();
        }
		
		try{
			user.setIconUrl(json.getString("icon"));
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	      	//e.printStackTrace();
	    }
		
		try{
			user.setEmail(json.getString("email"));			
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		try{
			user.setBirthday(json.getString("birthday"));			
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        //e.printStackTrace();
	    }
		
		try{
			user.setPhone(json.getString("phone"));			
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        //e.printStackTrace();
	    }
		
		return user;
	}
	
	public static Issue getIssue(JSONObject json){
		Issue issue = new Issue();
		
		try{
			issue.set_id(json.getString("_id"));
			issue.setDescription(json.getString("description"));
			issue.setDiscoverTime(json.getString("discoverTime")
					.substring(0, 19).replace("T", " "));
			issue.setSolved(json.getBoolean("solved"));
			issue.setFinder(getUser(json.getJSONObject("finder")));
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		return issue;
	}

	public static Task getTask(JSONObject json){
		Task task = new Task();
		try{
			task.set_id(json.getString("_id"));
			task.setTitle(json.getString("title"));
			task.setDescription(json.getString("description"));
			task.setCreateTime(json.getString("createTime").substring(0, 19).replace("T", " "));
			task.setStartTime(json.getString("startTime").substring(0,10));
			task.setDeadline(json.getString("deadline").substring(0, 10));
			
			ArrayList<String> executerId = new ArrayList<String>();
			JSONArray exec = json.getJSONArray("executer");
			for(int i=0;i<exec.length();i++){
				executerId.add(exec.getString(i));
			}
			task.setExecuter(executerId);
			task.setProgress(json.getInt("progress"));
			task.setEstimate(json.getInt("estimate"));
			task.setState(json.getInt("state"));
			task.setType(json.getInt("type"));
			
		}catch (JSONException e) {
            // TODO Auto-generated catch block
        	e.printStackTrace();
        }
		
		
		return task;
	}

	public static Comment getComment(JSONObject json){
		Comment comment = new Comment();
		
		try{
			comment.set_id(json.getString("_id"));
			comment.setBody(json.getString("body"));
			comment.setDate(json.getString("date").substring(0, 19).replace("T", " "));
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		try{
			comment.setOwner(getUser(json.getJSONObject("owner")));
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		return comment;
	}
	
	public static Topic getTopic(JSONObject json){
		Topic topic = new Topic();
		
		try{
			topic.set__v(json.getInt("__v"));
			topic.set_id(json.getString("_id"));
			topic.setAuthor(getUser(json.getJSONObject("author")));
			topic.setBody(json.getString("body"));
			
			List<Comment> comments = new ArrayList<Comment>();
			JSONArray commentArray = json.getJSONArray("comments");
			for(int i=0;i<commentArray.length();i++){
				Comment comment = getComment(commentArray.getJSONObject(i));
				comments.add(comment);
			}
			
			topic.setComments(comments);
			topic.setDate(json.getString("date").substring(0, 19).replace("T", " "));
			topic.setDeleted(json.getBoolean("deleted"));
			topic.setTitle(json.getString("title"));
			
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		return topic;
	}

	public static Member getMember(JSONObject json){
		Member member = new Member();
		try{
			member.set_id(json.getString("_id"));
			member.setName(json.getString("name"));
			member.setAdmin(json.getBoolean("isAdmin"));
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		try{
			member.setGroup(json.getString("group"));
		}catch (JSONException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
		
		
		return member;
	}
}
