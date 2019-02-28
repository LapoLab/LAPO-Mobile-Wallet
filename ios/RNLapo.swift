//
//  Lapo.swift
//  Lapo
//
//  Created by Develexe Company on 22/11/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Zip
import SQLite
import BRCore
//import Zip

var pathDB: String?
var isBlockDB: Bool = false

var wallet: BRWallet?
var peerManager: BRPeerManager? = nil

var listernWallet: ListernerWallet?
var listernPeerManager:ListernerPeerManager?

// mytable
let ID = Expression<Int64>("id")
let HASH = Expression<Blob?>("hash")
let HEIGHT = Expression<Int>("height")

// transaction
let TX_ID = Expression<Int64>("id")
let TX_COLUMN_ID = Expression<String>("TX_COLUMN_ID")
let TX_HASH = Expression<Blob?>("TX_BUFF")
let TX_HEIGHT = Expression<Int64>("TX_BLOCK_HEIGHT")
let TX_TIME_STAMP = Expression<Int>("TX_TIME_STAMP")
let TX_AMOUNT = Expression<Int>("amount")

// transactionOut
let TX_OUT_ID = Expression<Int64>("id")
let TX_OUT_AMOUNT = Expression<Int>("amount")
let TX_OUT_ADDRESS = Expression<String>("address")
let TX_OUT_TIME = Expression<Int>("time")
let TX_OUT_NOTE = Expression<String>("note")

class ListernerWallet: BRWalletListener {
  var notification: LapoNotifications  = LapoNotifications()
  var isBlockDB: Bool = false
  var db: Connection? = nil
  
  init() {
    //    var notification: LapoNotifications = LapoNotifications()
    //    self.notification.requestAuthorization()
    do {
      self.db = try Connection(pathDB!)
    }
    catch {
      print("Connection db went wrong")
    }
    
  }
  
  func balanceChanged(_ balance: UInt64) {
    print("balance chnage", balance)
  }
  
  func txAdded(_ tx: BRTxRef) {
    if (!self.isBlockDB) {
      do {
        try self.db?.transaction {
          let transactions = Table("transactions")
          
          print("db:", db?.description)
          
          var buf = [UInt8](repeating: 0, count: BRTransactionSerialize(tx, nil, 0))
          //      let timestamp = (tx.pointee.timestamp > UInt32(NSTimeIntervalSince1970)) ? tx.pointee.timestamp - UInt32(NSTimeIntervalSince1970) : 0
          //      [tx.pointee.blockHeight.littleEndian, timestamp.littleEndian].withUnsafeBytes { buf.append(contentsOf: $0) }
          
          
          BRTransactionSerialize(tx, &buf, buf.count)
          
          print("txHash::::", tx.pointee.txHash)
          print("time::::", tx.pointee.lockTime)
          print("tx.pointee.blockHeight::::", tx.pointee.blockHeight, Int64(tx.pointee.blockHeight))
          print("=======>>>>>>>>::::", Blob(bytes: buf).toHex())
          
          let insert = transactions.insert(
            TX_COLUMN_ID <-  "\(tx.pointee.txHash)",
            TX_HASH <- Blob(bytes: buf),
            //        TX_HASH <- buf,
            TX_HEIGHT <- Int64(tx.pointee.blockHeight),
            TX_TIME_STAMP <- Int(tx.pointee.timestamp)
          )
          let rowid = try self.db?.run(insert)
          print("rowid::", rowid)
          
          
          
          let amountReceived = wallet?.amountReceivedFromTx(tx) ?? 0
          let amountSent = wallet?.amountSentByTx(tx) ?? 0
          
          let fee = wallet?.feeForTx(tx) ?? 0
          
          let myAddress = tx.outputs.filter({ output in
            wallet?.containsAddress(output.swiftAddress) ?? false
          }).first?.swiftAddress ?? ""
          let otherAddress = tx.outputs.filter({ output in
            !(wallet?.containsAddress(output.swiftAddress) ?? true)
          }).first?.swiftAddress ?? ""
          let otherInputAddress = tx.inputs.filter({ output in
            !(wallet?.containsAddress(output.swiftAddress) ?? true)
          }).first?.swiftAddress ?? ""
          
          var direction: TransactionDirection
          if amountSent > 0 && (amountReceived + fee) == amountSent {
            direction = .moved
          } else if amountSent > 0 {
            direction = .sent
          } else {
            direction = .received
          }
          
          let endingBalance: UInt64 = wallet?.balanceAfterTx(tx) ?? 0
          var startingBalance: UInt64
          var address: String
          var amount: UInt64
          
          switch direction {
          case .received:
            //        address = myAddress
            address = otherInputAddress
            amount = amountReceived
            startingBalance = endingBalance.subtractingReportingOverflow(amount).0.subtractingReportingOverflow(fee).0
          case .sent:
            address = otherAddress
            amount = amountSent - amountReceived - fee
            startingBalance = endingBalance.addingReportingOverflow(amount).0.addingReportingOverflow(fee).0
          case .moved:
            address = myAddress
            amount = amountSent
            startingBalance = endingBalance.addingReportingOverflow(fee).0
          }
          
          //      let outputsTransaction = tx.pointee.outputs
          
          //      let isValid = wallet?.transactionIsValid(tx) ?? false
          
          //      _ = (tx.pointee.blockHeight == UInt32.max) ? UInt64.max :  UInt64(tx.pointee.blockHeight)
          
          
          let status: TransactionStatus
          
          if direction == .received {
            notification.send("Recieve new transaction", "from " + address,  "+ \(Double(amount) / 1000000.0)  LAX")
          }
          print("txAdded", tx)
        }
      }
      catch {
        print("Something went wrong")
      }
    }
  }
  
  func txUpdated(_ txHashes: [UInt256], blockHeight: UInt32, timestamp: UInt32) {
    print("txUpdated", txHashes, blockHeight, timestamp)
    if(!self.isBlockDB) {
      do {
        //        let db = try Connection(pathDB!)
        
        let transactions = Table("transactions")
        try self.db?.transaction {
          for txHash in txHashes {
            print("_------------::", "\(txHash)", Int64(blockHeight), Int(timestamp))
            let alice = transactions.filter(TX_COLUMN_ID == "\(txHash)")
            
            let row = try self.db?.run(alice.update(TX_HEIGHT <- Int64(blockHeight),
                                                    TX_TIME_STAMP <- Int(timestamp)))
            
            self.db?.trace { print($0) }
            
          }
        }
      }
      catch {
        print("Something went wrong")
      }
    }
    
  }
  
  func txDeleted(_ txHash: UInt256, notifyUser: Bool, recommendRescan: Bool) {
    print("txDeleted", txHash, notifyUser, recommendRescan)
    
    if(!self.isBlockDB) {
      do {
        try self.db?.transaction {
          //        let db = try Connection(pathDB!)
          
          let transactions = Table("transactions")
          
          //        if recommendRescan {
          //          let txs = transactions.filter(TX_COLUMN_ID == "\(txHash)")
          //          for tx in try db.prepare(txs) {
          //            print("TX_HEIGHT: \(tx[TX_HEIGHT])")
          //            DispatchQueue.global(qos: .background).async {
          //              peerManager?.rescan(fromBlockHeight: UInt32(tx[TX_HEIGHT]))
          //            }
          //          }
          //        }
          
          print("_------------::", txHash)
          let alice = transactions.filter(TX_COLUMN_ID == "\(txHash)")
          
          //        let row = try db.run(alice.remove())
          try db?.run(alice.delete())
          
          print("delete row in db", "\(txHash)")
        }
        
      }
      catch {
        print("Something went wrong")
      }
    }
  }
}

class ListernerPeerManager: BRPeerManagerListener {
  var dbForBlocks: Connection?
  var isBlockDB: Bool = false
  
  func syncStarted() {
    print("syncStarted")
  }
  
  func syncStoped() {
    print("syncStoped")
  }
  
  func saveBlocks(_ replace: Bool, _ blockRefs: [BRBlockRef?]) {
    if(!self.isBlockDB) {
      let blocks: [BRBlockRef?] = blockRefs.map { blockRef in
        if let b = blockRef {
          return BRMerkleBlockCopy(&b.pointee)
        } else {
          return nil
        }
      }
      do {
        
        for b in blocks {
          let blocksSql = Table("mytable")
          //        print("blocks:", b?.pointee.height)
          //        print("db:", self.dbForBlocks?.description)
          
          //        let timeValid = b?.pointee.timestamp ?? 0
          
          //        print("block valid save:", b?.pointee.height, BRMerkleBlockIsValid(b, timeValid))
          
          var buf = [UInt8](repeating: 0, count: BRMerkleBlockSerialize(b, nil, 0))
          let time = b?.pointee.timestamp ?? 0
          let timestamp = time - UInt32(NSTimeIntervalSince1970)
          [b?.pointee.height.littleEndian, timestamp.littleEndian].withUnsafeBytes { buf.append(contentsOf: $0) }
          
          BRMerkleBlockSerialize(b, &buf, buf.count)
          
          
          let height = b?.pointee.height ?? 0
          
          let insert = blocksSql.insert(
            ID <- Int64(height),
            HASH <- Blob(bytes: buf),
            HEIGHT <- Int(height)
          )
          let rowid = try self.dbForBlocks?.run(insert)
          print("insert block:", Int(height))
          
        }
      }
      catch {
        
      }
    }
    
  }
  
  func savePeers(_ replace: Bool, _ peers: [BRPeer]) {
    print("savePeers")
    
  }
  
  func syncStopped(_ error: BRPeerManagerError?) {
    
  }
  func txStatusUpdate() {
    
  }
  
  func networkIsReachable() -> Bool {
    return !self.isBlockDB
  }
}

struct Transaction: Codable {
  var id: String
  var time : UInt32?
  var mode : String
  var amount : UInt64?
  var address : String
  var status: String
}

struct Info: Codable {
  var curHeight : UInt32
  var allHeight : UInt32
}

@objc(RNLapo)
class RNLapo: NSObject {
  var notification: LapoNotifications  = LapoNotifications()
  
  //  var listernWallet: ListernerWallet?  = ListernerWallet()
  //  var listernPeerManager: ListernerPeerManager?  = ListernerPeerManager()
  
  //  var wallet: BRWallet?
  var oldAddress: String?
  //  var peerManager: BRPeerManager? = nil
  
  var isReady: Bool = false
  var isLoadingStart: Bool = false
  var pdfURL: URL?
  
  var earliestKeyTime: TimeInterval = 0
  
  var seedPhrase: String = "asda as "
  
  //  var workItem: DispatchWorkItem = DispatchWorkItem{}
  
  
  //   Implement methods that you want to export to the native module
  @objc func lapoName(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    //    var masterPubKey = BRMasterPubKey()
    
    resolve("laponame !")
  }
  
  public static var documentsDirectoryURL: URL {
    return FileManager.default.urls(for:.documentDirectory, in: .userDomainMask)[0]
  }
  public static func fileURLInDocumentDirectory(_ fileName: String) -> URL {
    return self.documentsDirectoryURL.appendingPathComponent(fileName)
  }
  
  public static func storeImageToDocumentDirectory(image: UIImage, fileName: String) -> URL? {
    guard let data = image.pngData() else {
      return nil
    }
    let fileURL = self.fileURLInDocumentDirectory(fileName)
    do {
      try data.write(to: fileURL)
      return fileURL
    } catch {
      return nil
    }
  }
  
  @objc func generateQRCode(_ paperWords: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    print("generateQRCode::", paperWords)
    
    // Get data from the string
    let data = paperWords.data(using: String.Encoding.ascii)
    // Get a QR CIFilter
    guard let qrFilter = CIFilter(name: "CIQRCodeGenerator") else { return }
    // Input the data
    qrFilter.setValue(data, forKey: "inputMessage")
    // Get the output image
    guard let qrImage = qrFilter.outputImage else { return }
    // Scale the image
    let transform = CGAffineTransform(scaleX: 10, y: 10)
    let scaledQrImage = qrImage.transformed(by: transform)
    
    
    // Do some processing to get the UIImage
    let context = CIContext()
    guard let cgImage = context.createCGImage(scaledQrImage, from: scaledQrImage.extent) else { return }
    let processedImage = UIImage(cgImage: cgImage)
    let pathQR = RNLapo.storeImageToDocumentDirectory(image: processedImage, fileName: "./qrCode.png")
    
    print("pathQR::", pathQR?.path)
    resolve(pathQR?.path)
  }
  
  @objc func setPhrase(_ phrase: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    self.seedPhrase = phrase
    resolve("ok")
  }
  
  @objc func isLoadingStartWallet(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve(isLoadingStart)
  }
  
  @objc func isLoadWallet(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve(isLoadingStart)
  }
  
  
  @objc func reScan(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    print("reScan:---->>>>>---->>>>---->>>>:1111:")
    peerManager?.disconnect()
    sleep(1)
    print("reScan:---->>>>>---->>>>---->>>>:1111:")
    
    peerManager?.connect()
    print("reScan:---->>>>>---->>>>---->>>>:1111:")
    
    resolve("ok")
  }
  
  @objc func disconnect(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    isBlockDB = true
    listernPeerManager?.isBlockDB = true
    listernWallet?.isBlockDB = true
    isReady = false
    
    sleep(1)
    
    print("disconnect::1111:")
    DispatchQueue.global(qos: .background).async {
      peerManager?.disconnect()
      //      peerManager?.clearCallbacks()
    }
    DispatchQueue.global(qos: .background).async {
      peerManager?.disconnect()
      //      peerManager?.clearCallbacks()
    }
    DispatchQueue.global(qos: .background).async {
      peerManager?.disconnect()
      //      peerManager?.clearCallbacks()
    }
    //    peerManager?.clearCallbacks()
    
    sleep(10)
    
    print("disconnect::111---111:", peerManager?.connectionStatus)
    
    
    //    peerManager?.clearCallbacks()
    //    if peerManager != nil {
    //      BRPeerManagerDisconnect(peerManager?.cPtr)
    //      BRPeerManagerFree(peerManager?.cPtr)
    //    }
    
    peerManager = nil
    //    wallet = nil
    sleep(5)
    
    listernPeerManager = nil
    listernWallet = nil
    print("disconnect::222")
    
    resolve("ok")
  }
  
  @objc func resync(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    
    do {
      let db = try Connection(pathDB!)
      
      let transactionsSql = Table("transactions")
      try db.run(transactionsSql.delete())
      
      let blocksSql = Table("mytable")
      try db.run(blocksSql.delete())
      
    }
    catch {
      print("Something went wrong")
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Something went wrong", "Something went wrong", error)
    }
    resolve("ok")
  }
  
  @objc func setPathDB(_ newPathDB: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    pathDB = newPathDB
    resolve("ok")
  }
  
  @objc func copyDB(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    do {
      if pathDB == nil {
        print("copyDB")
        let filePath = Bundle.main.url(forResource: "lapotables1311", withExtension: "zip")!
        print("copyDB", filePath)
        
        let documentsDirectory = FileManager.default.urls(for:.documentDirectory, in: .userDomainMask)[0]
        
        try Zip.unzipFile(filePath, destination: documentsDirectory, overwrite: true, password: "", progress: { (progress) -> () in
          print(progress)
        })// Unzip
        
        let unzipDirectory = documentsDirectory
        print("copyDB", unzipDirectory)
        let fileManager = FileManager.default
        if fileManager.fileExists(atPath: unzipDirectory.appendingPathComponent("lapotables1311.db").path ) {
          
          pathDB = unzipDirectory.appendingPathComponent("lapotables1311.db").path
          print("--->>>1")
          let db = try Connection(pathDB!)
          let blocksSql = Table("mytable")
          let alice = blocksSql.filter(HEIGHT > 444000)
          print("--->>>2", db.busyTimeout)
          try db.run(alice.delete())
          
          let blocksSqlTx = Table("transactions")
          let txs = blocksSqlTx.filter(TX_HEIGHT > 0)
          print("--->>>2", db.busyTimeout)
          try db.run(txs.delete())
          
          print("--->>>3")
          print("FILE AVAILABLE")
          
        } else {
          print("FILE NOT AVAILABLE")
        }
      } else {
        let fileManager = FileManager.default
        if fileManager.fileExists(atPath: pathDB ?? "") {
          print("--->>>1")
          let db = try Connection(pathDB!)
          let blocksSql = Table("mytable")
          let alice = blocksSql.filter(HEIGHT > 444000)
          print("--->>>2", db.busyTimeout)
          try db.run(alice.delete())
          
          let blocksSqlTx = Table("transactions")
          let txs = blocksSqlTx.filter(TX_HEIGHT > 0)
          print("--->>>2", db.busyTimeout)
          try db.run(txs.delete())
          
          print("--->>>3")
          print("FILE AVAILABLE")
          
        } else {
          print("FILE NOT AVAILABLE")
        }
      }
      
    }
    catch {
      print("Something went wrong")
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Something went wrong", "Something went wrong", error)
    }
    
    
    resolve(pathDB)
  }
  
  @objc func connectPeers(_ resolve: RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    print("connectPeers")
    isBlockDB = false
    self.isLoadingStart = true
    self.isReady = false
    
    listernWallet = ListernerWallet()
    listernPeerManager = ListernerPeerManager()
    
    var transactions = [BRTxRef?]()
    
    do {
      let db = try Connection(pathDB!)
      
      let transactionsSql = Table("transactions")
      
      for tranaction in try db.prepare(transactionsSql) {
        let buf = tranaction[TX_HASH]?.bytes
        let len = tranaction[TX_HASH]?.bytes.count ?? 0
        
        let off = len ?? 0
        
        guard let tx = BRTransactionParse(buf, len) else {return print("OH TRANSaCTION PARSE!!!!")}
        
        tx.pointee.blockHeight = UInt32(tranaction[TX_HEIGHT])
        
        tx.pointee.timestamp = UInt32(tranaction[TX_TIME_STAMP])
        //        if (tranaction[TX_HEIGHT] < 2147483647) {
        transactions.append(tx)
        //        }
        
      }
    } catch {
      print("Something went wrong")
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Something went wrong", "Something went wrong", error)
    }
    print("read transaction")
    
    var seed = UInt512()
    
    BRBIP39DeriveKey(&seed, self.seedPhrase, nil)
    let mpk = BRBIP32MasterPubKey(&seed, MemoryLayout<UInt512>.size)
    
    print("create master key", transactions == nil, mpk == nil )
    
    seed = UInt512() // clear seed
    
    wallet = BRWallet(transactions: transactions, masterPubKey: mpk, listener: listernWallet!)
    
    print("create wallet")
    //    isLoadingStart = true
    //
    self.oldAddress = wallet?.receiveAddress
    
    var blocks = [BRBlockRef?]()
    
    print("pathDB:::", pathDB!)
    do {
      listernPeerManager?.dbForBlocks = try Connection(pathDB!)
    }
    catch {
      print("Something went wrong")
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Something went wrong", "Something went wrong", error)
    }
    
    let fileManager = FileManager.default
    if fileManager.fileExists(atPath: pathDB! ) {
      
      print("FILE AVAILABLE")
      
    } else {
      print("FILE NOT AVAILABLE")
    }
    
    
    do {
      let db = try Connection(pathDB!)
      print("db:", db.description)
      
      
      let blocksSql = Table("mytable")
      
      print("blocks:")
      
      for block in try db.prepare(blocksSql.order(ID)) {
        let b = BRMerkleBlockParse(block[HASH]?.bytes, block[HASH]!.bytes.count)
        //        b?.
        //        print("b ------:", b)
        b?.pointee.height = UInt32(block[HEIGHT])
        
        let blockHashes = b?.pointee.blockHash
        
        let hashes = blockHashes.unsafelyUnwrapped
        let hashesCount: Int = b?.pointee.hashesCount ?? 0
        let flags = b?.pointee.flags
        let flagsLen = b?.pointee.flagsLen ?? 0
        
        //        print("block hashes:", hashes)
        //        print("block hashesCount:", hashesCount)
        //        print("block flags:", flags)
        //        print("block flagsLen:", flagsLen)
        
        BRMerkleBlockSetTxHashes(b,
                                 [hashes],
                                 hashesCount,
                                 flags,
                                 flagsLen)
        //        let time = b?.pointee.timestamp ?? 0
        //        print("block valid:", block[HEIGHT])
        blocks.append(b)
        
      }
      print("END LOAD BLCOKS", blocks.count, listernPeerManager == nil)
      
      peerManager = BRPeerManager(wallet: wallet!,
                                  earliestKeyTime: self.earliestKeyTime,
                                  blocks: blocks,
                                  peers: [],
                                  listener: listernPeerManager!)
      self.isReady = true
      print("peerManager start connect")
      
      //      DispatchQueue.global(qos: .background).async {
      //        peerManager?.connect()
      //      }
      
      //            self.workItem = DispatchWorkItem {
      //.... writing stuff in background ....
//      peerManager?.connect()
      //            }
      //      DispatchQueue.global(qos: .background).async {
      peerManager?.connect()
      //      }
      //            DispatchQueue.global().async(execute: workItem)
    }
    catch {
      print("Something went wrong")
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Something went wrong", "Something went wrong", error)
    }
    resolve("ok")
  }
  
  @objc func getLastBlockHeight(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    let exampleDict = Info(
      curHeight: peerManager?.lastBlockHeight ?? 0,
      allHeight: peerManager?.estimatedBlockHeight ?? 0)
    
    let jsonEncoder = JSONEncoder()
    
    do {
      
      let jsonData = try jsonEncoder.encode(exampleDict)
      
      resolve(String(data: jsonData, encoding: .utf8))
    } catch {
      resolve("jsonString")
    }
  }
  
  @objc func isReady(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    print("isReady::::", self.isReady)
    resolve(self.isReady)
  }
  
  @objc func createWallet(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    //        let seedPhrase: String? = "asda as "
    var transactions = [BRTxRef?]()
    
    do {
      let db = try Connection(pathDB!)
      
      let transactionsSql = Table("transactions")
      
      for tranaction in try db.prepare(transactionsSql) {
        let buf = tranaction[TX_HASH]?.bytes
        let len = tranaction[TX_HASH]?.bytes.count ?? 0
        
        print("--------->>", tranaction[TX_HASH]?.toHex())
        
        let off = len ?? 0
        
        guard let tx = BRTransactionParse(buf, len) else {return print("OH TRANSaCTION PARSE!!!!")}
        
        tx.pointee.blockHeight = UInt32(tranaction[TX_HEIGHT])
        
        tx.pointee.timestamp = UInt32(tranaction[TX_TIME_STAMP])
        transactions.append(tx)
        
      }
    } catch {
      print("Something went wrong")
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Something went wrong", "Something went wrong", error)
    }
    var seed = UInt512()
    
    BRBIP39DeriveKey(&seed, self.seedPhrase, nil)
    let mpk = BRBIP32MasterPubKey(&seed, MemoryLayout<UInt512>.size)
    
    seed = UInt512() // clear seed
    
    print(mpk)
    
    //        let listener = ListernerWallet()
    
    wallet = BRWallet(transactions: transactions, masterPubKey: mpk, listener: listernWallet!)
    //
    self.oldAddress = wallet?.receiveAddress
    
    resolve("createWallet")
  }
  
  @objc func getBalance(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    resolve(wallet?.balance)
  }
  
  @objc func getReceiveAddress(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    resolve(wallet?.receiveAddress)
  }
  
  @objc func getTransactions(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    let transactions = wallet?.transactions
    let jsonEncoder = JSONEncoder()
    var exampleDict = [Transaction?]()
    
    //    print("all address::", self.wallet?.allAddresses)
    //    print("", self.wallet.c)
    //    let allAddress = wallet?.allAddresses ?? []
    
    for tras in transactions! {
      
      if tras!.pointee.blockHeight < UInt32.max {
        let amountReceived = wallet?.amountReceivedFromTx(tras!) ?? 0
        let amountSent = wallet?.amountSentByTx(tras!) ?? 0
        
        let tx = tras!
        
        let fee = wallet?.feeForTx(tx) ?? 0
        
        let myAddress = tx.outputs.filter({ output in
          wallet?.containsAddress(output.swiftAddress) ?? false
        }).first?.swiftAddress ?? ""
        let otherAddress = tx.outputs.filter({ output in
          !(wallet?.containsAddress(output.swiftAddress) ?? true)
        }).first?.swiftAddress ?? ""
        let otherInputAddress = tx.inputs.filter({ output in
          !(wallet?.containsAddress(output.swiftAddress) ?? true)
        }).first?.swiftAddress ?? ""
        
        var direction: TransactionDirection
        if amountSent > 0 && (amountReceived + fee) == amountSent {
          direction = .moved
        } else if amountSent > 0 {
          direction = .sent
        } else {
          direction = .received
        }
        
        let endingBalance: UInt64 = wallet?.balanceAfterTx(tx) ?? 0
        var startingBalance: UInt64
        var address: String
        var amount: UInt64
        
        switch direction {
        case .received:
          //        address = myAddress
          address = otherInputAddress
          amount = amountReceived
          startingBalance = endingBalance.subtractingReportingOverflow(amount).0.subtractingReportingOverflow(fee).0
        case .sent:
          address = otherAddress
          amount = amountSent - amountReceived - fee
          startingBalance = endingBalance.addingReportingOverflow(amount).0.addingReportingOverflow(fee).0
        case .moved:
          address = myAddress
          amount = amountSent
          startingBalance = endingBalance.addingReportingOverflow(fee).0
        }
        
        let outputsTransaction = tras?.pointee.outputs
        
        let isValid = wallet?.transactionIsValid(tx) ?? false
        
        let blockHeight = (tx.pointee.blockHeight == UInt32.max) ? UInt64.max :  UInt64(tx.pointee.blockHeight)
        
        let lastBlockHeight = UInt64(peerManager?.lastBlockHeight ?? 0)
        let confirmations = blockHeight > lastBlockHeight
          ? 0
          : (lastBlockHeight - blockHeight) + 1
        
        let status: TransactionStatus
        
        if isValid {
          switch confirmations {
          case 0:
            status = .pending
          case 1..<6:
            status = .confirmed
          default:
            status = .complete
          }
        } else {
          status = .invalid
        }
        //      print("STATUS>>>>>>>", status)
        
        if isValid && direction != .moved {
          exampleDict.append(Transaction(
            id: "\(tras?.pointee.txHash)",
            time: tras?.pointee.timestamp,
            mode: direction.rawValue,
            amount: amount,
            address: address,
            status: status.rawValue))
        }
      }
    }
    
    do {
      
      let jsonData = try jsonEncoder.encode(exampleDict)
      
      resolve(String(data: jsonData, encoding: .utf8))
    } catch {
      resolve("jsonString")
    }
    
  }
  
  @objc func newTransaction(_ address: String, amounter amount: String, noter note: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    print("newTransaction:::", address, amount)
    NSLog("newTransaction---->>>", address, amount);
    var seed = UInt512()
    BRBIP39DeriveKey(&seed, self.seedPhrase, nil)
    
    let allAddress = wallet?.allAddresses ?? []
    
    if allAddress.contains(address) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Payment to youself is not possible", "Payment to youself is not possible", error)
      return
    }
    
    let amountFloat = (Float(amount) ?? 0) * 1000000.0
    
    let tx = wallet?.createTransaction(forAmount: UInt64(amountFloat), toAddress: address)
    print("transactions::", tx ?? "")
    if( tx == nil) {
      let error = NSError(domain: "", code: 200, userInfo: nil)
      reject("Not enough money", "Not enough money", error)
      return
    }
    wallet?.signTransaction(tx!, forkId: 0, seed: &seed)
    
    peerManager?.publishTx(tx!, completion: { (complete, error) in
      print("complete publish", complete, error ?? "")
    })
    seed = UInt512()
    
    resolve("\(tx?.pointee.txHash)")
  }
}


extension RNLapo:  URLSessionDownloadDelegate {
  func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didFinishDownloadingTo location: URL) {
    print("downloadLocation:", location)
    
    guard let url = downloadTask.originalRequest?.url else { return }
    let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    let destinationURL = documentsPath.appendingPathComponent(url.lastPathComponent)
    // delete original copy
    try? FileManager.default.removeItem(at: destinationURL)
    // copy from temp to Document
    do {
      try FileManager.default.copyItem(at: location, to: destinationURL)
      self.pdfURL = destinationURL
      print("destinationUR::", destinationURL)
    } catch let error {
      print("Copy Error: \(error.localizedDescription)")
    }
  }
}
