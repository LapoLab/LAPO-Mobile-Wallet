//
//  Environment.swift
//  breadwallet
//
//  Created by Adrian Corscadden on 2017-06-20.
//  Copyright © 2017 breadwallet LLC. All rights reserved.
//

import Foundation

struct E {
    static let isTestnet: Bool = {
        #if Testnet
        return true
        #else
        return false
        #endif
    }()
    
    static let isTestFlight: Bool = {
        #if Testflight
        return true
        #else
        return false
        #endif
    }()
    
    static let isSimulator: Bool = {
        #if targetEnvironment(simulator)
        return true
        #else
        return false
        #endif
    }()
    
    static let isDebug: Bool = {
        #if Debug
        return true
        #else
        return false
        #endif
    }()
    
    static let isScreenshots: Bool = {
        #if Screenshots
        return true
        #else
        return false
        #endif
    }()
    
    static let isRunningTests: Bool = {
        #if Debug
        return ProcessInfo.processInfo.environment["XCTestConfigurationFilePath"] != nil
        #else
        return false
        #endif
    }()
}

