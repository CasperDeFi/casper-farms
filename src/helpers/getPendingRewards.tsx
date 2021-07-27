import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { useState } from 'react'
import poolAbi from '../data/pool-abi.json'
import tokenAbi from '../data/token-abi.json'

export default async function GetPendingRewards() {
    const wallet = useWallet()
    const web3 = new Web3(wallet.ethereum)

    const POOL_CONTRACT_ADDRESS = '0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74'
    const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)

    let pendingCasper = 0

    if (wallet.account) {
        for (let pid = 0; pid < 4; pid++) {
            const pendingReward = await contract.methods.pendingCASPER(pid, wallet.account).call()
            pendingCasper += pendingReward
        }
    }

    return pendingCasper
}

export async function GetPendingRewardsUSD() {
    const wallet = useWallet()
    const web3 = new Web3(wallet.ethereum)

    const POOL_CONTRACT_ADDRESS = '0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74'
    const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)

    let pendingCasper = 0

    if (wallet.account) {
        for (let pid = 0; pid < 4; pid++) {
            const pendingReward = await contract.methods.pendingCASPER(pid, wallet.account).call()
            pendingCasper += pendingReward
        }
    }

    const contractCASPER = new web3.eth.Contract(tokenAbi as any, '0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345')
    const CasperPriceRequest = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=casper-defi&vs_currencies=usd')
    const CasperPriceResponse = await CasperPriceRequest.json()
    const CasperPrice = CasperPriceResponse['casper-defi'].usd

    const casperValue = pendingCasper * CasperPrice
    casperValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    return casperValue
}
