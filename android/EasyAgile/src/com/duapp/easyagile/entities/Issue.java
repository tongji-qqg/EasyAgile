package com.duapp.easyagile.entities;

public class Issue {

	private String _id;
	private String description;
	private boolean solved;
	private String discoverTime;
	private User finder;
	
	public Issue(){		
	}
	
	public Issue(String _id, String description, boolean solved, String discoverTime, User finder){
		this._id = _id;
		this.description = description;
		this.solved = solved;
		this.discoverTime = discoverTime;
		this.finder = finder;
	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isSolved() {
		return solved;
	}

	public void setSolved(boolean solved) {
		this.solved = solved;
	}

	public String getDiscoverTime() {
		return discoverTime;
	}

	public void setDiscoverTime(String discoverTime) {
		this.discoverTime = discoverTime;
	}

	public User getFinder() {
		return finder;
	}

	public void setFinder(User finder) {
		this.finder = finder;
	}
	
	
	
}
