//  Created by react-native-create-bridge
#import <Foundation/Foundation.h>
#import <Foundation/NSObject.h>

// import RCTViewManager
#if __has_include(<React/RCTViewManager.h>)
#import <React/RCTViewManager.h>
#elif __has_include(“RCTViewManager.h”)
#import “RCTViewManager.h”
#else
#import “React/RCTViewManager.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
//#if __has_include(<React/RCTEventDispatcher.h>)
//#import <React/RCTEventDispatcher.h>
//#elif __has_include(“RCTEventDispatcher.h”)
//#import “RCTEventDispatcher.h”
//#else
//#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
//#endif

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html#exporting-swift
@interface RCT_EXTERN_MODULE(RNLapoCore, NSObject)


RCT_EXTERN_METHOD(lapoName: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(setLastTransactions: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(createWallet: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getBalance: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getReceiveAddress: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getTransactions: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(newTransaction: (NSString *)address amount:(NSString *)amount callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(incBalanceWallet: (RCTResponseSenderBlock)callback)


@end
