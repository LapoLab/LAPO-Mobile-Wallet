//
//  RCTSelectContact.h
//  RCTSelectContact
//

#import <React/RCTBridgeModule.h>

@import Contacts;
@import ContactsUI;
#import <Contacts/Contacts.h>
#import <ContactsUI/ContactsUI.h>

@interface RCTSelectContact : NSObject <RCTBridgeModule, CNContactPickerDelegate, CNContactViewControllerDelegate>

@end
