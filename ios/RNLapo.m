//
//  RNLapo.m
//  Lapo
//
//  Created by Develexe Company on 22/11/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "AppDelegate.h"

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
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html#exporting-swift
@interface RCT_EXTERN_MODULE(RNLapo, NSObject)
RCT_EXTERN_METHOD(isReady: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(copyDB: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(connectPeers: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(lapoName: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLastTransactions: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createWallet: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getReceiveAddress: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disconnect: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isLoadingStartWallet: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isLoadWallet: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reScan: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(resync: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLastBlockHeight: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getTransactions: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(newTransaction: (NSString *)address amounter:(NSString *)amount noter:(NSString *)note resolver: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(incBalanceWallet: (RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateQRCode: (NSString *)paperWords resolver:(RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setPhrase: (NSString *)phrase resolver:(RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setPathDB: (NSString *)newPathDB resolver:(RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(initDownloadManager: (NSString *)pathPdf resolver:(RCTPromiseResolveBlock)resolve   rejecter:(RCTPromiseRejectBlock)reject)
@end
