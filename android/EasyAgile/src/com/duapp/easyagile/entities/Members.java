package com.duapp.easyagile.entities;

import java.util.ArrayList;
import java.util.List;

public class Members {
	private User owner;
	private String ownerGroup="未分组";
	private List<Member> members;
	private List<String> groups;
	
	
	public List<List<Member>> getAllMembersInGroup(){
		List<List<Member>> allMembersInGroup = new ArrayList<List<Member>>();
		//Member类型的owner
		Member mOwner = new Member();
		mOwner.set_id(owner.get_id());
		mOwner.setAdmin(true);
		mOwner.setGroup(ownerGroup);
		mOwner.setName(owner.getName());
		mOwner.setUser(owner);
		
		//按group 把成员添加到list里
		for(int i=0;i<groups.size();i++){
			allMembersInGroup.add(new ArrayList<Member>());
		}
		for(int i=0;i<groups.size();i++){
			if(mOwner.getGroup().equals(groups.get(i)))
				allMembersInGroup.get(i).add(mOwner);
			for(int j=0;j<members.size();j++){
				if(members.get(j).getGroup().equals(groups.get(i)))
					allMembersInGroup.get(i).add(members.get(j));
			}
		}
		
		return allMembersInGroup;
	}
	
	
	public User getOwner() {
		return owner;
	}
	public void setOwner(User owner) {
		this.owner = owner;
	}
	public String getOwnerGroup() {
		return ownerGroup;
	}
	public void setOwnerGroup(String ownerGroup) {
		this.ownerGroup = ownerGroup;
	}
	public List<Member> getMembers() {
		return members;
	}
	public void setMembers(List<Member> members) {
		this.members = members;
	}
	public List<String> getGroups() {
		return groups;
	}
	public void setGroups(List<String> groups) {
		this.groups = groups;
	}
	
	
}
