//
//  RCTSelectContact.m
//  RCTSelectContact
//

@import Foundation;
#import <AddressBook/AddressBook.h>
#import "RCTSelectContact.h"
@interface RCTSelectContact()

@property(nonatomic, retain) RCTPromiseResolveBlock _resolve;
@property(nonatomic, retain) RCTPromiseRejectBlock _reject;
@property NSString* address;

@end


@implementation RCTSelectContact {
  CNContactStore * contactStore;
  
  RCTResponseSenderBlock updateContactCallback;
}

RCT_EXPORT_MODULE(SelectContact);

//- (instancetype)init
//{
//  self = [super init];
//  if (self) {
//    [self preLoadContactView];
//  }
//  return self;
//}
//
//- (void)preLoadContactView
//{
//  // Init the contactViewController so it will display quicker first time it's accessed
//  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//    NSLog(@"Preloading CNContactViewController");
//    CNContactViewController *contactViewController = [CNContactViewController viewControllerForNewContact:nil];
//    [contactViewController view];
//  });
//}

-(void) getAllContacts:(RCTResponseSenderBlock) callback
        withThumbnails:(BOOL) withThumbnails
{
  CNContactStore* contactStore = [self contactsStore:callback];
  if(!contactStore)
    return;
  
  [self retrieveContactsFromAddressBook:contactStore withThumbnails:withThumbnails withCallback:callback];
}

-(void) retrieveContactsFromAddressBook:(CNContactStore*)contactStore
                         withThumbnails:(BOOL) withThumbnails
                           withCallback:(RCTResponseSenderBlock) callback
{
  NSMutableArray *contacts = [[NSMutableArray alloc] init];
  
  NSError* contactError;
  [contactStore containersMatchingPredicate:[CNContainer predicateForContainersWithIdentifiers: @[contactStore.defaultContainerIdentifier]] error:&contactError];
  
  
  NSMutableArray *keysToFetch = [[NSMutableArray alloc]init];
  [keysToFetch addObjectsFromArray:@[
                                     CNContactEmailAddressesKey,
                                     CNContactPhoneNumbersKey,
                                     CNContactFamilyNameKey,
                                     CNContactGivenNameKey,
                                     CNContactMiddleNameKey,
                                     CNContactPostalAddressesKey,
                                     CNContactOrganizationNameKey,
                                     CNContactJobTitleKey,
                                     CNContactImageDataAvailableKey,
                                     CNContactNoteKey,
                                     CNContactUrlAddressesKey,
                                     CNContactBirthdayKey
                                     ]];
  
  if(withThumbnails) {
    [keysToFetch addObject:CNContactThumbnailImageDataKey];
  }
  
  CNContactFetchRequest * request = [[CNContactFetchRequest alloc]initWithKeysToFetch:keysToFetch];
  BOOL success = [contactStore enumerateContactsWithFetchRequest:request error:&contactError usingBlock:^(CNContact * __nonnull contact, BOOL * __nonnull stop){
    NSDictionary *contactDict = [self contactToDictionary: contact withThumbnails:withThumbnails];
    [contacts addObject:contactDict];
  }];
  
  callback(@[[NSNull null], contacts]);
}

-(NSDictionary*) contactToDictionary:(CNContact *) person
                      withThumbnails:(BOOL)withThumbnails
{
  NSMutableDictionary* output = [NSMutableDictionary dictionary];
  
  NSString *recordID = person.identifier;
  NSString *givenName = person.givenName;
  NSString *familyName = person.familyName;
  NSString *middleName = person.middleName;
  NSString *company = person.organizationName;
  NSString *jobTitle = person.jobTitle;
  NSString *note = person.note;
  NSDateComponents *birthday = person.birthday;
  
  [output setObject:recordID forKey: @"recordID"];
  
  if (givenName) {
    [output setObject: (givenName) ? givenName : @"" forKey:@"givenName"];
  }
  
  if (familyName) {
    [output setObject: (familyName) ? familyName : @"" forKey:@"familyName"];
  }
  
  if(middleName){
    [output setObject: (middleName) ? middleName : @"" forKey:@"middleName"];
  }
  
  if(company){
    [output setObject: (company) ? company : @"" forKey:@"company"];
  }
  
  if(jobTitle){
    [output setObject: (jobTitle) ? jobTitle : @"" forKey:@"jobTitle"];
  }
  
  if(note){
    [output setObject: (note) ? note : @"" forKey:@"note"];
  }
  
  if (birthday) {
    if (birthday.month != NSDateComponentUndefined && birthday.day != NSDateComponentUndefined) {
      //months are indexed to 0 in JavaScript (0 = January) so we subtract 1 from NSDateComponents.month
      if (birthday.year != NSDateComponentUndefined) {
        [output setObject:@{@"year": @(birthday.year), @"month": @(birthday.month - 1), @"day": @(birthday.day)} forKey:@"birthday"];
      } else {
        [output setObject:@{@"month": @(birthday.month - 1), @"day":@(birthday.day)} forKey:@"birthday"];
      }
    }
  }
  
  //handle phone numbers
  NSMutableArray *phoneNumbers = [[NSMutableArray alloc] init];
  
  for (CNLabeledValue<CNPhoneNumber*>* labeledValue in person.phoneNumbers) {
    NSMutableDictionary* phone = [NSMutableDictionary dictionary];
    NSString * label = [CNLabeledValue localizedStringForLabel:[labeledValue label]];
    NSString* value = [[labeledValue value] stringValue];
    
    if(value) {
      if(!label) {
        label = [CNLabeledValue localizedStringForLabel:@"other"];
      }
      [phone setObject: value forKey:@"number"];
      [phone setObject: label forKey:@"label"];
      [phoneNumbers addObject:phone];
    }
  }
  
  [output setObject: phoneNumbers forKey:@"phoneNumbers"];
  //end phone numbers
  
  //handle urls
  NSMutableArray *urlAddresses = [[NSMutableArray alloc] init];
  
  for (CNLabeledValue<NSString*>* labeledValue in person.urlAddresses) {
    NSMutableDictionary* url = [NSMutableDictionary dictionary];
    NSString* label = [CNLabeledValue localizedStringForLabel:[labeledValue label]];
    NSString* value = [labeledValue value];
    
    if(value) {
      if(!label) {
        label = [CNLabeledValue localizedStringForLabel:@"home"];
      }
      [url setObject: value forKey:@"url"];
      [url setObject: label forKey:@"label"];
      [urlAddresses addObject:url];
    } else {
      NSLog(@"ignoring blank url");
    }
  }
  
  [output setObject: urlAddresses forKey:@"urlAddresses"];
  
  //end urls
  
  //handle emails
  NSMutableArray *emailAddreses = [[NSMutableArray alloc] init];
  
  for (CNLabeledValue<NSString*>* labeledValue in person.emailAddresses) {
    NSMutableDictionary* email = [NSMutableDictionary dictionary];
    NSString* label = [CNLabeledValue localizedStringForLabel:[labeledValue label]];
    NSString* value = [labeledValue value];
    
    if(value) {
      if(!label) {
        label = [CNLabeledValue localizedStringForLabel:@"other"];
      }
      [email setObject: value forKey:@"email"];
      [email setObject: label forKey:@"label"];
      [emailAddreses addObject:email];
    } else {
      NSLog(@"ignoring blank email");
    }
  }
  
  [output setObject: emailAddreses forKey:@"emailAddresses"];
  //end emails
  
  //handle postal addresses
  NSMutableArray *postalAddresses = [[NSMutableArray alloc] init];
  
  for (CNLabeledValue<CNPostalAddress*>* labeledValue in person.postalAddresses) {
    CNPostalAddress* postalAddress = labeledValue.value;
    NSMutableDictionary* address = [NSMutableDictionary dictionary];
    
    NSString* street = postalAddress.street;
    if(street){
      [address setObject:street forKey:@"street"];
    }
    NSString* city = postalAddress.city;
    if(city){
      [address setObject:city forKey:@"city"];
    }
    NSString* state = postalAddress.state;
    if(state){
      [address setObject:state forKey:@"state"];
    }
    NSString* region = postalAddress.state;
    if(region){
      [address setObject:region forKey:@"region"];
    }
    NSString* postCode = postalAddress.postalCode;
    if(postCode){
      [address setObject:postCode forKey:@"postCode"];
    }
    NSString* country = postalAddress.country;
    if(country){
      [address setObject:country forKey:@"country"];
    }
    
    NSString* label = [CNLabeledValue localizedStringForLabel:labeledValue.label];
    if(label) {
      [address setObject:label forKey:@"label"];
      
      [postalAddresses addObject:address];
    }
  }
  
  [output setObject:postalAddresses forKey:@"postalAddresses"];
  //end postal addresses
  
  [output setValue:[NSNumber numberWithBool:person.imageDataAvailable] forKey:@"hasThumbnail"];
  if (withThumbnails) {
    [output setObject:[self getFilePathForThumbnailImage:person recordID:recordID] forKey:@"thumbnailPath"];
  }
  
  return output;
}

- (NSString *)thumbnailFilePath:(NSString *)recordID
{
  NSString *filename = [recordID stringByReplacingOccurrencesOfString:@":ABPerson" withString:@""];
  NSString* filepath = [NSString stringWithFormat:@"%@/rncontacts_%@.png", [self getPathForDirectory:NSCachesDirectory], filename];
  return filepath;
}

- (NSString *)getPathForDirectory:(int)directory
{
  NSArray *paths = NSSearchPathForDirectoriesInDomains(directory, NSUserDomainMask, YES);
  return [paths firstObject];
}


-(NSString *) getFilePathForThumbnailImage:(CNContact*) contact recordID:(NSString*) recordID
{
  NSString *filepath = [self thumbnailFilePath:recordID];
  
  if([[NSFileManager defaultManager] fileExistsAtPath:filepath]) {
    return filepath;
  }
  
  if (contact.imageDataAvailable){
    NSData *contactImageData = contact.thumbnailImageData;
    
    BOOL success = [[NSFileManager defaultManager] createFileAtPath:filepath contents:contactImageData attributes:nil];
    
    if (!success) {
      NSLog(@"Unable to copy image");
      return @"";
    }
    
    return filepath;
  }
  
  return @"";
}

RCT_EXPORT_METHOD(getAll:(RCTResponseSenderBlock) callback)
{
  [self getAllContacts:callback withThumbnails:true];
}

RCT_EXPORT_METHOD(openContactSelection:(NSString *)address idContacter:(NSString *)idContact resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  self._resolve = resolve;
  self._reject = reject;
  self.address = address;
  
  NSLog(@"openContactSelection");

  NSLog(@"%@", idContact);
  NSLog(@"%@", idContact);
  NSLog(@"%@", idContact);
  NSLog(@"%lu", (unsigned long)idContact.length);
  
  if (idContact.length == 0) {
    UIViewController *picker = [[CNContactPickerViewController alloc] init];
    
//    NSArray *keys = @[CNContactIdentifierKey,
//                      CNContactEmailAddressesKey];
//
//    CNMutableContact *contact = [[CNMutableContact alloc] init];
//    contact.familyName = @"Smith";
//    contact.givenName = @"Jane";
//
//    CNContactViewController *contactViewController = [CNContactViewController viewControllerForUnknownContact:contact];

    
    ((CNContactPickerViewController *)picker).delegate = self;
    
    // Launch Contact Picker
    UIViewController *root = [[[UIApplication sharedApplication] delegate] window].rootViewController;
    BOOL modalPresent = (BOOL) (root.presentedViewController);
    if (modalPresent) {
      UIViewController *parent = root.presentedViewController;
      [parent presentViewController:picker animated:YES completion:nil];
    } else {
      [root presentViewController:picker animated:YES completion:nil];
    }
  } else {
    NSLog(@"openContactSelection idContact 1");
    NSString* recordID = idContact;
    
    NSArray *keys = @[CNContactIdentifierKey,
                      CNContactEmailAddressesKey,
                      CNContactBirthdayKey,
                      CNContactImageDataKey,
                      CNContactPhoneNumbersKey,
                      [CNContactFormatter descriptorForRequiredKeysForStyle:CNContactFormatterStyleFullName],
                      [CNContactViewController descriptorForRequiredKeys]];
    
    CNContact *contact = [contactStore unifiedContactWithIdentifier:recordID keysToFetch:keys error:nil];
    CNContactViewController *contactViewController = [CNContactViewController viewControllerForContact:contact];
    
    NSLog(@"openContactSelection idContact 2");
    // Add a cancel button which will close the view
    // TODO localize cancel button title (either through creating a localized strings file, or passing in the title)
    contactViewController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Cancel" style:UIBarButtonItemStylePlain target:self action:@selector(cancelContactForm)];
    contactViewController.delegate = self;
    
    
    dispatch_async(dispatch_get_main_queue(), ^{
      UINavigationController* navigation = [[UINavigationController alloc] initWithRootViewController:contactViewController];
//      UIViewController *rooViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
      UIViewController *rooViewController = [[[UIApplication sharedApplication] delegate] window].rootViewController;

      
      // Cover the contact view with an activity indicator so we can put it in edit mode without user seeing the transition
      UIActivityIndicatorView *activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
      activityIndicatorView.frame = UIScreen.mainScreen.applicationFrame;
      [activityIndicatorView startAnimating];
      activityIndicatorView.backgroundColor = [UIColor whiteColor];
      [navigation.view addSubview:activityIndicatorView];
      
//      [rooViewController presentViewController:navigation animated:YES completion:nil];
      
      BOOL modalPresent = (BOOL) (rooViewController.presentedViewController);
      if (modalPresent) {
        UIViewController *parent = rooViewController.presentedViewController;
//        [parent presentViewController:picker animated:YES completion:nil];
        [parent presentViewController:navigation animated:YES completion:nil];

      } else {
//        [rooViewController presentViewController:picker animated:YES completion:nil];
        [rooViewController presentViewController:navigation animated:YES completion:nil];

      }
      
      [contactViewController performSelector:@selector(toggleEditing:) withObject:nil afterDelay:0.1];
      
      // remove the activity indicator after a delay so the underlying transition will have time to complete
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [activityIndicatorView removeFromSuperview];
      });
      
    });
  }
}

- (NSMutableDictionary *) emptyContactDict {
  NSMutableArray *phones = [[NSMutableArray alloc] init];
  NSMutableArray *emails = [[NSMutableArray alloc] init];
  NSMutableArray *addresses = [[NSMutableArray alloc] init];
  return [[NSMutableDictionary alloc] initWithObjects:@[@"", @"", @"", @"", phones, emails, addresses]
                                              forKeys:@[@"name", @"givenName", @"middleName", @"familyName", @"phones", @"emails", @"postalAddresses"]];
}

#pragma mark - CNContactPickerDelegate
- (void)contactPicker:(CNContactPickerViewController *)picker didSelectContact:(CNContact *)contact {
  
  /* Return NSDictionary ans JS Object to RN, containing basic contact data
   This is a starting point, in future more fields should be added, as required.
   */
  NSMutableDictionary *contactData = [self emptyContactDict];
  
  
  //Return name
  NSString *fullName = [self getFullNameForFirst:contact.givenName middle:contact.middleName last:contact.familyName ];
  [contactData setValue:fullName forKey:@"name"];
  [contactData setValue:contact.givenName forKey:@"givenName"];
  [contactData setValue:contact.middleName forKey:@"middleName"];
  [contactData setValue:contact.familyName forKey:@"familyName"];
  
  //Return phone numbers
  NSMutableArray* phoneEntries = [contactData valueForKey:@"phones"];
  for (CNLabeledValue<CNPhoneNumber*> *phone in contact.phoneNumbers) {
    CNPhoneNumber* phoneNumber = [phone value];
    NSString* phoneLabel = [phone label];
    NSMutableDictionary<NSString*, NSString*>* phoneEntry = [[NSMutableDictionary alloc] initWithCapacity:2];
    [phoneEntry setValue:[phoneNumber stringValue] forKey:@"number"];
    [phoneEntry setValue:[CNLabeledValue localizedStringForLabel:phoneLabel] forKey:@"type"];
    [phoneEntries addObject:phoneEntry];
  }
  
  //Return email addresses
  NSMutableArray* emailEntries = [contactData valueForKey:@"emails"];
  for (CNLabeledValue<NSString*> *email in contact.emailAddresses) {
    NSString* emailAddress = [email value];
    NSString* emailLabel = [email label];
    NSMutableDictionary<NSString*, NSString*>* emailEntry = [[NSMutableDictionary alloc] initWithCapacity:2];
    [emailEntry setValue:emailAddress forKey:@"address"];
    [emailEntry setValue:[CNLabeledValue localizedStringForLabel:emailLabel] forKey:@"type"];
    [emailEntries addObject:emailEntry];
  }
  
//  NSString* emailAddress = @"LAX";
//  NSString* emailLabel = @"LAX";
//  NSMutableDictionary<NSString*, NSString*>* emailEntry = [[NSMutableDictionary alloc] initWithCapacity:2];
//  [emailEntry setValue:emailAddress forKey:@"address"];
//  [emailEntry setValue:[CNLabeledValue localizedStringForLabel:emailLabel] forKey:@"type"];
//  [emailEntries addObject:emailEntry];
  
  // Return postal addresses
  NSMutableArray* addressEntries = [contactData valueForKey:@"postalAddresses"];
  for (CNLabeledValue<CNPostalAddress*> *postalAddress in contact.postalAddresses) {
    CNPostalAddress* addressInfo = [postalAddress value];
    NSMutableDictionary<NSString*, NSString*>* addressEntry = [[NSMutableDictionary alloc] init];
    [addressEntry setValue:[addressInfo street] forKey:@"street"];
    [addressEntry setValue:[addressInfo city] forKey:@"city"];
    [addressEntry setValue:[addressInfo state] forKey:@"state"];
    [addressEntry setValue:[addressInfo postalCode] forKey:@"postalCode"];
    [addressEntry setValue:[addressInfo ISOCountryCode] forKey:@"isoCountryCode"];
    [addressEntries addObject:addressEntry];
  }
  
  
  /* Return NSDictionary ans JS Object to RN, containing basic contact data
   This is a starting point, in future more fields should be added, as required.
   */
  NSError* contactError;
  
  NSArray * keysToFetch =@[
                           CNContactEmailAddressesKey,
                           ];
  
  CNMutableContact* record = [[contactStore unifiedContactWithIdentifier:contact.identifier keysToFetch:keysToFetch error:&contactError] mutableCopy];
  
  NSMutableArray *emails = [[NSMutableArray alloc]init];
  
//  emails = record.emailAddresses;
  
  for (CNLabeledValue<NSString*> *email in record.emailAddresses) {
    NSString* emailAddress = [email value];
    NSString* emailLabel = [email label];
//    NSMutableDictionary<NSString*, NSString*>* emailEntry = [[NSMutableDictionary alloc] initWithCapacity:2];
//    [emailEntry setValue:emailAddress forKey:@"address"];
//    [emailEntry setValue:[CNLabeledValue localizedStringForLabel:emailLabel] forKey:@"type"];
//    [emails addObject:emailEntry];
    [emails addObject:[[CNLabeledValue alloc] initWithLabel:emailLabel value:emailAddress]];
  }
  
  NSString *label = @"lax";
  NSString *email = self.address;
  
  if(label && email) {
    [emails addObject:[[CNLabeledValue alloc] initWithLabel:label value:email]];
  }
  
  record.emailAddresses = emails;
  
  
//  [self updateRecord:record withData:contactData];
  CNSaveRequest *request = [[CNSaveRequest alloc] init];
  [request updateContact:record];
  
  [contactStore executeSaveRequest:request error:nil];
  
  /* Return NSDictionary ans JS Object to RN, containing basic contact data
   This is a starting point, in future more fields should be added, as required.
   */
  
  self._resolve(contactData);
}

-(NSString *) getFullNameForFirst:(NSString *)fName middle:(NSString *)mName last:(NSString *)lName {
  //Check whether to include middle name or not
  NSArray *names = (mName.length > 0) ? [NSArray arrayWithObjects:fName, mName, lName, nil] : [NSArray arrayWithObjects:fName, lName, nil];
  return [names componentsJoinedByString:@" "];
}

- (void)contactPickerDidCancel:(CNContactPickerViewController *)picker {
  self._reject(@"E_CONTACT_CANCELLED", @"Cancelled", nil);
}

-(CNContactStore*) contactsStore: (RCTResponseSenderBlock)callback {
  if(!contactStore) {
    CNContactStore* store = [[CNContactStore alloc] init];
    
    if(!store.defaultContainerIdentifier) {
      NSLog(@"warn - no contact store container id");
      
      CNAuthorizationStatus authStatus = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
      if (authStatus == CNAuthorizationStatusDenied || authStatus == CNAuthorizationStatusRestricted){
        callback(@[@"denied", [NSNull null]]);
      } else {
        callback(@[@"undefined", [NSNull null]]);
      }
      
      return nil;
    }
    
    contactStore = store;
  }
  
  return contactStore;
}

RCT_EXPORT_METHOD(openUnknownContact:(NSDictionary *)contactData callback:(RCTResponseSenderBlock)callback)
{
  if(!contactStore) {
    contactStore = [[CNContactStore alloc] init];
  }
//
  NSString* address = [contactData valueForKey:@"address"];
//
//  NSArray *keys = @[CNContactIdentifierKey,
//                    CNContactEmailAddressesKey,
//                    CNContactBirthdayKey,
//                    CNContactImageDataKey,
//                    CNContactPhoneNumbersKey,
//                    [CNContactFormatter descriptorForRequiredKeysForStyle:CNContactFormatterStyleFullName],
//                    [CNContactViewController descriptorForRequiredKeys]];
  
  @try {
    
//    CNContact *contact = [contactStore unifiedContactWithIdentifier:recordID keysToFetch:keys error:nil];
    
    CNMutableContact *contact = [[CNMutableContact alloc] init];
//    contact.familyName = @"Smith";
//    contact.givenName = @"Jane";
    
    CNLabeledValue *mailtest = [CNLabeledValue labeledValueWithLabel:@"lax" value:address];
    contact.emailAddresses = @[mailtest];
    
    CNContactViewController *contactViewController = [CNContactViewController viewControllerForNewContact:contact];
    
    contactViewController.allowsActions = NO;
//    contactViewController.modalPresentationStyle = UIModalPresentationFormSheet;
    contactViewController.contactStore = [[CNContactStore alloc] init];
    
    // Add a cancel button which will close the view
    // TODO localize cancel button title (either through creating a localized strings file, or passing in the title)
    contactViewController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Cancel" style:UIBarButtonItemStylePlain target:self action:@selector(cancelContactForm)];
    contactViewController.delegate = self;
    
    
    dispatch_async(dispatch_get_main_queue(), ^{
      UINavigationController* navigation = [[UINavigationController alloc] initWithRootViewController:contactViewController];
      UIViewController *rooViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
      
      // Cover the contact view with an activity indicator so we can put it in edit mode without user seeing the transition
      UIActivityIndicatorView *activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
      activityIndicatorView.frame = UIScreen.mainScreen.applicationFrame;
      [activityIndicatorView startAnimating];
      activityIndicatorView.backgroundColor = [UIColor whiteColor];
      [navigation.view addSubview:activityIndicatorView];
      
      [rooViewController presentViewController:navigation animated:YES completion:nil];
      
      // We need to wait for a short while otherwise contactViewController will not respond to the selector (it has not initialized)
      [contactViewController performSelector:@selector(toggleEditing:) withObject:nil afterDelay:0.1];
      
      // remove the activity indicator after a delay so the underlying transition will have time to complete
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [activityIndicatorView removeFromSuperview];
      });
      
//      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        updateContactCallback(@[[NSNull null]]);
//      });
      
      updateContactCallback = callback;
    });
    
  }
  @catch (NSException *exception) {
    callback(@[[exception description], [NSNull null]]);
  }
}

- (void)contactViewController:(CNContactViewController *)viewController
       didCompleteWithContact:(CNContact *)contact{
  UIViewController *rootViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
  [rootViewController dismissViewControllerAnimated:YES completion:nil];
  if (updateContactCallback != nil) {
    updateContactCallback(@[[NSNull null]]);
    updateContactCallback = nil;
  }
}

RCT_EXPORT_METHOD(openExistingContact:(NSDictionary *)contactData callback:(RCTResponseSenderBlock)callback)
{
  if(!contactStore) {
    contactStore = [[CNContactStore alloc] init];
  }
  
  NSString* recordID = [contactData valueForKey:@"recordID"];
  
  NSArray *keys = @[CNContactIdentifierKey,
                    CNContactEmailAddressesKey,
                    CNContactBirthdayKey,
                    CNContactImageDataKey,
                    CNContactPhoneNumbersKey,
                    [CNContactFormatter descriptorForRequiredKeysForStyle:CNContactFormatterStyleFullName],
                    [CNContactViewController descriptorForRequiredKeys]];
  
  @try {
    
    CNContact *contact = [contactStore unifiedContactWithIdentifier:recordID keysToFetch:keys error:nil];
    CNContactViewController *contactViewController = [CNContactViewController viewControllerForContact:contact];
    
    // Add a cancel button which will close the view
    // TODO localize cancel button title (either through creating a localized strings file, or passing in the title)
    contactViewController.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Cancel" style:UIBarButtonItemStylePlain target:self action:@selector(cancelContactForm)];
    contactViewController.delegate = self;
    
    
    dispatch_async(dispatch_get_main_queue(), ^{
      UINavigationController* navigation = [[UINavigationController alloc] initWithRootViewController:contactViewController];
      UIViewController *rooViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
      
      // Cover the contact view with an activity indicator so we can put it in edit mode without user seeing the transition
      UIActivityIndicatorView *activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
      activityIndicatorView.frame = UIScreen.mainScreen.applicationFrame;
      [activityIndicatorView startAnimating];
      activityIndicatorView.backgroundColor = [UIColor whiteColor];
      [navigation.view addSubview:activityIndicatorView];
      
      [rooViewController presentViewController:navigation animated:YES completion:nil];
      
      // TODO should this 'fake click' method be used? For a brief instance
      // Fake click edit button to enter edit mode
      //                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      //                    SEL selector = contactViewController.navigationItem.rightBarButtonItem.action;
      //                    NSLog(@"!!!!!!!!!!!!!!!!!! FAKE CLICK!!!  %@", NSStringFromSelector(selector));
      //                    id  target = contactViewController.navigationItem.rightBarButtonItem.target;
      //                    [target performSelector:selector];
      //                });
      
      
      // We need to wait for a short while otherwise contactViewController will not respond to the selector (it has not initialized)
      [contactViewController performSelector:@selector(toggleEditing:) withObject:nil afterDelay:0.1];
      
      // remove the activity indicator after a delay so the underlying transition will have time to complete
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [activityIndicatorView removeFromSuperview];
      });
      
      updateContactCallback = callback;
    });
    
  }
  @catch (NSException *exception) {
    callback(@[[exception description], [NSNull null]]);
  }
}

- (void)toggleEditing
{
  //  if (updateContactCallback != nil) {
  
  //    UIViewController *rooViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
  
//  UIViewController *rootViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
//  [rootViewController dismissViewControllerAnimated:YES completion:nil];
  
  updateContactCallback(@[[NSNull null]]);
  updateContactCallback = nil;
  //  }
}

- (void)cancelContactForm
{
//  if (updateContactCallback != nil) {
  
//    UIViewController *rooViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
  
    UIViewController *rootViewController = (UIViewController*)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
  
    updateContactCallback(@[[NSNull null]]);
    updateContactCallback = nil;
//  }
}

RCT_EXPORT_METHOD(checkPermission:(RCTResponseSenderBlock) callback)
{
  CNAuthorizationStatus authStatus = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  if (authStatus == CNAuthorizationStatusDenied || authStatus == CNAuthorizationStatusRestricted){
    callback(@[[NSNull null], @"denied"]);
  } else if (authStatus == CNAuthorizationStatusAuthorized){
    callback(@[[NSNull null], @"authorized"]);
  } else {
    callback(@[[NSNull null], @"undefined"]);
  }
}

RCT_EXPORT_METHOD(requestPermission:(RCTResponseSenderBlock) callback)
{
  CNContactStore* contactStore = [[CNContactStore alloc] init];
  
  [contactStore requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
    [self checkPermission:callback];
  }];
}

@end
