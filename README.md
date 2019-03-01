# Lapo

## Introduction
Lapo is a PIVX / DASH cryptocurrency wallet works without servers.

First launch of the application:
1. The wallet is restored or a new one is created
2. Unpack archive with base (in which blocks and transactions up to 444 thousand blocks) RNLapoCoreModule -> copyDB
3. After we get transaction blocks from the database, load the wallet BRWalletManager -> loadTransactions, BRWalletManager-> loadBlocks
4. Connect to the network, start downloading blocks from the network together with transactions, save them to the HelloService database -> onStartCommand; Blocks come from the network to the BRWalletManager callbacks -> onTxAdded onTxUpdated saveBlocks
At the next launch, the blocks with transactions from the database are read and connected to the network. Downloading blocks and network sharing is done in the HelloService.
When restoring, we break the connection with the network and unpack the archive with the blocks, load the wallet and connect with the network.

## Key features:

- creation of a new wallet
- wallet recovery
- send and receive crypto coins
- show balance, transactions
- reset wallet
- profile

## Technology
 - Languages ​- C ++ Java JavaScript Swift
 - Framework for creation of mobile application - React Native
 - Static typing - Flow
 - Application state management - Redux
 - Navigation in the application - React-Navigation

# Run
Package installation
---

```sh
yarn
```
Server launch
---

```sh
yarn start        # starts dev server
```

Running an application on ios
---

`` sh
yarn ios # runs ios
`` `
Running an application for a specific iPhone model
---
 - iPhone SE

`` sh
yarn ios --simulator = "iPhone SE"
`` `

 - iPhone X

`` sh
yarn ios --simulator = "iPhone X”
`` `

- iPhone 7 Plus

`` sh
yarn ios --simulator = "iPhone 7 Plus”
`` `

Requirement to android build 
---
- cmake version 3.6.4111459
- ndk-bundle current version 17
download (https://developer.android.com/ndk/downloads/older_releases)
  and unzip to ~/⁨Library/Android⁩/⁨sdk⁩/ndk-bundle⁩

Requirement to android build 
---
- cmake version 3.6.4111459
- ndk-bundle current version 17
download (https://developer.android.com/ndk/downloads/older_releases)
and unzip to ~ / Library / Android / sdk / ndk bundle


Running an application on android
---
1. Run the emulator:

`` `
Launch Android Studio -> Tools -> AVD Manager Add or select a device and launch
`` `

2. Run the application

`` sh
yarn android # run android, before starting, you must start the emulator or connect the device.
`` `

Build for production android
-----
`` sh
react-native bundle - platform android - dev false - center-file index.js - bundle-output android / app / src / main / assets / index.android.bundle - assets-dest android / app / build / intermediates / res / merged / release /
`` `

Then build -> Generate signed app

# Architecture

RN is used for ui and for communication with native code. Java native code and Swift are associated with C ++ code. C ++ code is an adapted version of breadwallet-core.

Rn
There is the modular architecture of src/modules in RN. In the module, if necessary, you can find reduser, actions and saga.

Native code for Android
---
Stored in the js package lapo-core, in the android directory.


Native code for IOS
---
Stored in the ios folder. Run the project through the file Lapo.xcworkspace (Xcode Workspace). In the folder ios/Modules/adapted version of the breadwallet-core for Lapo in C ++.

Components
---
 - The main components of the system are in src/commons/components/.
- System modules are in src / modudels /.

Common
---
 - how API is used only native in Java/C ++ and Swift/C ++


Redux and Sagas
---
 - Redusers are located in src/modules/Module name/reducers,
 - Sagas are located in src / modules / Module Name / sagas,
 - Store settings located in src/edux/ store.js,
 - Actions are located in src/modules/module name/actions.


Screens
---

 - Located in src / modules.
 - Nesting of screens can be found in the src / Navigation navigation.

Pictures, icons
---

 - Located in src / asserts

Utilities
---
# Dependencies

Main libraries:
- react-native
- redux
- redux-actions
- redux-saga
- react-navigation
- flow
- jest```