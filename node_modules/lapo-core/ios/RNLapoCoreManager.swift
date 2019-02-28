//  Created by react-native-create-bridge

import Foundation
import BRCore

class ListernerWallet: BRWalletListener {
    func balanceChanged(_ balance: UInt64) {
        print("balance chnage", balance)
    }
    
    func txAdded(_ tx: BRTxRef) {
        print("txAdded", tx)
    }
    
    func txUpdated(_ txHashes: [UInt256], blockHeight: UInt32, timestamp: UInt32) {
        print("txUpdated", txHashes, blockHeight, timestamp)
    }
    
    func txDeleted(_ txHash: UInt256, notifyUser: Bool, recommendRescan: Bool) {
        print("txDeleted", txHash, notifyUser, recommendRescan)
    }
}

@objc(RNLapoCore)
class RNLapoCore: NSObject {
    
    private let listernWallet = ListernerWallet()
    var wallet: BRWallet?
    let seedPhrase: String = "asda as "
    
    //   Implement methods that you want to export to the native module
    @objc func lapoName(_ callback: RCTResponseSenderBlock){
        var masterPubKey = BRMasterPubKey()
        
        callback(["laponame !", masterPubKey])
    }
    
    @objc func setLastTransactions(_ callback: RCTResponseSenderBlock){
        callback(["nil", "setLastTransactions"])
    }
    
    @objc func createWallet(_ callback: RCTResponseSenderBlock){
//        let seedPhrase: String? = "asda as "
        var seed = UInt512()

        BRBIP39DeriveKey(&seed, self.seedPhrase, nil)
        let mpk = BRBIP32MasterPubKey(&seed, MemoryLayout<UInt512>.size)
        seed = UInt512() // clear seed
        
        print(mpk)
        
//        let listener = ListernerWallet()
        
        self.wallet = BRWallet(transactions: [], masterPubKey: mpk, listener: self.listernWallet)
//
        print("address::", wallet?.receiveAddress)
        
        print("balance::", wallet?.balance)
        
        callback([nil, "createWallet"])
    }
    
    @objc func getBalance(_ callback: RCTResponseSenderBlock){
        callback([nil, self.wallet?.balance])
    }
    
    @objc func getReceiveAddress(_ callback: RCTResponseSenderBlock){
        callback([nil, self.wallet?.receiveAddress])
    }
    
    @objc func getTransactions(_ callback: RCTResponseSenderBlock){
        callback([nil, self.wallet?.transactions])
    }
    
    @objc func newTransaction(_ address: String, amount amount: String, callback callback: RCTResponseSenderBlock){
        print("newTransaction:::", address, amount)
        var seed = UInt512()
        BRBIP39DeriveKey(&seed, self.seedPhrase, nil)

        let tx = self.wallet?.createTransaction(forAmount: 1, toAddress: "asd")
        print("transactions::", tx)
        if( tx == nil) {
            callback(["no money", nil])
            return
        }
        self.wallet?.signTransaction(tx!, forkId: 0, seed: &seed)
        seed = UInt512()
        
        callback([nil, "newTransaction"])
    }
    
    @objc func incBalanceWallet(_ callback: RCTResponseSenderBlock){
        callback([nil, "incBalanceWallet"])
    }

}
