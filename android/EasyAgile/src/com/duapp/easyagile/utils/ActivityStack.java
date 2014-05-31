package com.duapp.easyagile.utils;

import java.util.LinkedList;
import java.util.List;
 


import com.duapp.easyagile.activities.EntranceActivity;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
 
public class ActivityStack extends Application {
    private List<Activity> activitys = null;
    private static ActivityStack instance;
 
    private ActivityStack() {
        activitys = new LinkedList<Activity>();
    }
 
    /**
     * 单例模式中获取唯一的ActivityStack实例
     * 
     * @return
     */
    public static ActivityStack getInstance() {
        if (null == instance) {
            instance = new ActivityStack();
        }
        return instance;
 
    }
 
    // 添加Activity到容器中
    public void addActivity(Activity activity) {
        if (activitys != null && activitys.size() > 0) {
            if(!activitys.contains(activity)){
                activitys.add(activity);
            }
        }else{
            activitys.add(activity);
        }
         
    }
 
    public void logout(){
    	if (activitys != null && activitys.size() > 0) {
            for (Activity activity : activitys) {
                activity.finish();
            }
        }
    }
    
    // 遍历所有Activity并finish
    public void exit() {
        if (activitys != null && activitys.size() > 0) {
            for (Activity activity : activitys) {
                activity.finish();
            }
        }
        System.exit(0);
    }
 
}