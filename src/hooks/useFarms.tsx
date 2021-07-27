import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import pools from '../data/pools.json'
import tokenAbi from '../data/token-abi.json'
import poolAbi from '../data/pool-abi.json'

export default function useFarms(slug) {
    const wallet = useWallet()
    const web3 = new Web3(wallet.ethereum)

    const POOL_CONTRACT_ADDRESS = '0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74'

    const [balance, setBalance] = useState(0)
    const [status, setStatus] = useState('loading')
    const [poolInfo, setPoolInfo] = useState({})
    const [userInfo, setUserInfo] = useState({})

    const [tvl, setTvl] = useState(0)

    const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)

    const pool = pools.find((pool) => pool.slug === slug)
    const { id } = pool

    const approve = async (amount) => {
        const token = poolInfo?.lpToken

        if (!token) return

        const tokenContract = new web3.eth.Contract(tokenAbi as any, poolInfo?.lpToken)

        const allowanceFromWeb3 = await tokenContract.methods.allowance(wallet.account, POOL_CONTRACT_ADDRESS).call()

        if (amount > allowanceFromWeb3) {
            tokenContract.methods.approve(POOL_CONTRACT_ADDRESS, web3.utils.toWei('999999999999')).send({ from: wallet.account })
        }
    }

    const loadData = async () => {
        if (!wallet.account) return
        setStatus('loading')
        try {
            const userInfoFromWeb3 = await contract.methods.userInfo(id, wallet.account).call()
            setUserInfo(userInfoFromWeb3)
        } catch (error) {
            console.log(error)
        }

        try {
            const poolInfoFromWeb3 = await contract.methods.poolInfo(id).call()
            setPoolInfo(poolInfoFromWeb3)

            const tokenContract = new web3.eth.Contract(tokenAbi as any, poolInfoFromWeb3.lpToken)

            const balanceFromWeb3 = await tokenContract.methods.balanceOf(wallet.account).call()
            setBalance(balanceFromWeb3)
            console.log('Balance:',balance)

            const tvlFromWeb3 = await tokenContract.methods.balanceOf(POOL_CONTRACT_ADDRESS).call()

            setTvl(tvlFromWeb3)
        } catch (error) {
            console.log(error)
        }
        setStatus('idle')
    }

    const deposit = async (amount) => {
        setStatus('loading')
        try {
            await approve(amount)

            const gas = await contract.methods.deposit(id, amount).estimateGas({ from: wallet.account })

            await contract.methods.deposit(id, amount).send({ from: wallet.account })

            await loadData()
        } catch (error) {
            console.log(error)
        }
        setStatus('idle')
    }

    const withdraw = async (amount) => {
        setStatus('loading')
        try {
            const gas = await contract.methods.withdraw(id, amount).estimateGas({ from: wallet.account })
            await contract.methods.withdraw(id, amount).send({ from: wallet.account })
            await loadData()
        } catch (error) {
            console.log(error)
        }
        setStatus('idle')
    }

    const harvest = async () => {
        setStatus('loading')
        await deposit(0)
        await loadData()
        setStatus('idle')
    }

    useEffect(() => {
        const onInitialLoad = async () => {
            await loadData()
        }
        onInitialLoad()
    }, [wallet])

    return {
        status,
        web3,
        contract,
        approve,
        data: {
            ...pool,
            poolInfo,
            userInfo,
            tvl,
            balance
        },
        deposit,
        withdraw,
        harvest
    }
}
