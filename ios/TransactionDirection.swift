//
//  TransactionDirection.swift
//  Lapo
//
//  Created by Yuri Kuznetsov on 27/11/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

enum TransactionDirection : String {
  case sent = "input"
  case received = "out"
  case moved = "Moved"
}

/// Transacton status
enum TransactionStatus : String {
  /// Zero confirmations
  case pending = "pending"
  /// One or more confirmations
  case confirmed = "confirmed"
  /// Sufficient confirmations to deem complete (coin-specific)
  case complete = "complete"
  /// Invalid / error
  case invalid = "invalid"
}
