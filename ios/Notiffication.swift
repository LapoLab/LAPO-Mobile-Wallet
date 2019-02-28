//
//  Notiffication.swift
//  Lapo
//
//  Created by Yuri Kuznetsov on 13/02/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//
import UIKit
import UserNotifications

class LapoNotifications {
  let appDelegate = UIApplication.shared.delegate as? AppDelegate
  
  init() {
    //    var notification: LapoNotifications = LapoNotifications()
    //    self.notification.requestAuthorization()
    requestAuthorization()
  }
  
  
  func requestAuthorization(){
    if #available(iOS 10.0, *) {
      let debitOverdraftNotifCategory = UNNotificationCategory(identifier: "debitOverdraftNotification", actions: [], intentIdentifiers: [], options: [])
      // #1.2 - Register the notification type.
      appDelegate?.center.setNotificationCategories([debitOverdraftNotifCategory])
      
      appDelegate?.center.requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in
        print("granted: (\(granted)")
      
      }
    } else {
      // Fallback on earlier versions
    }
  }
  
  func send(_ title: String, _ subTitle: String,  _ body: String) {
    if #available(iOS 10.0, *) {
      appDelegate?.center.getNotificationSettings { (settings) in
        
        // we're only going to create and schedule a notification
        // if the user has kept notifications authorized for this app
        guard settings.authorizationStatus == .authorized else { return }
        
        // create the content and style for the local notification
        let content = UNMutableNotificationContent()
        
        // #2.1 - "Assign a value to this property that matches the identifier
        // property of one of the UNNotificationCategory objects you
        // previously registered with your app."
        content.categoryIdentifier = "debitOverdraftNotification"
        
        // create the notification's content to be presented
        // to the user
        content.title = title
        content.subtitle = subTitle
        content.body = body
        content.sound = UNNotificationSound.default
        content.badge = 1
        
        // #2.2 - create a "trigger condition that causes a notification
        // to be delivered after the specified amount of time elapses";
        // deliver after 10 seconds
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 2, repeats: false)
        
        // create a "request to schedule a local notification, which
        // includes the content of the notification and the trigger conditions for delivery"
        let uuidString = UUID().uuidString
        let request = UNNotificationRequest(identifier: uuidString, content: content, trigger: trigger)
        
        // "Upon calling this method, the system begins tracking the
        // trigger conditions associated with your request. When the
        // trigger condition is met, the system delivers your notification."
        print("add notification ->>>>>>>>>")
        self.appDelegate?.center.add(request, withCompletionHandler: nil)
        
      } // end getNotificationSettings
    }
  }
}


extension AppDelegate: UNUserNotificationCenterDelegate {
  @available(iOS 10.0, *)
  private func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    print("userNotificationCenter")
//    self.center = UNUserNotificationCenter.current()
//    self.center.delegate = self;
  }
}

