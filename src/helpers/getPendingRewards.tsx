import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { useState } from 'react'
import poolAbi from '../data/pool-abi.json'
import tokenAbi from '../data/token-abi.json'
import { fromWei } from 'web3-utils'



export default async function getTotalReward() {
    // const wallet = useWallet()
    // if(wallet.account){
    //     const web3 = new Web3(wallet.ethereum)
    //     const POOL_CONTRACT_ADDRESS = '0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74'
    //     const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)
    //     let pending = 0
    //     if (wallet.account) {
    //         for (let pid = 0; pid < 7; pid++) {
    //             const pendingReward = parseFloat(await contract.methods.pendingCASPER(pid, wallet.account).call())
    //             pending = pendingReward + pending
    //             console.log(pid, pendingReward)
    //         }
    //     }
    //     const formatted = fromWei(pending.toString())
    //     const final = parseFloat(formatted).toFixed(5)
    //     return (final)

    // }
    



}
