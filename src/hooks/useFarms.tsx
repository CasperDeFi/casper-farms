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

    const [tvl, setTvl] = useState("0")

    const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)

    const pool = pools.find((pool) => pool.slug === slug)
    const { id } = pool

    const approve = async (amount) => {
        //@ts-ignore
        const token = poolInfo?.lpToken

        if (!token) return

        //@ts-ignore
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

            // const tvlFromWeb3 = await tokenContract.methods.balanceOf(POOL_CONTRACT_ADDRESS).call()

            // setTvl(tvlFromWeb3)
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


    const getTVL = async () => {

        let web3Default = new Web3("Https://rpc.ftm.tools")

        const contractWFTM = new web3Default.eth.Contract(tokenAbi as any, "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83")
        const FTMPriceRequest = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd')
        const FTMPriceResponse = await FTMPriceRequest.json()
        const FTMPrice = FTMPriceResponse["fantom"]["usd"]

        const contractCASPER = new web3Default.eth.Contract(tokenAbi as any, "0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345")
        const CasperPriceRequest = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=casper-defi&vs_currencies=usd")
        const CasperPriceResponse = await CasperPriceRequest.json()
        let CasperPrice = CasperPriceResponse["casper-defi"]["usd"]

        const contractUSDC = new web3Default.eth.Contract(tokenAbi as any, "0x04068da6c83afcfa0e13ba15a6696662335d5b75")

        const chad = new web3.eth.Contract(poolAbi as any, "0xDA094Ee6bDaf65c911f72FEBfC58002e5e2656d1")

        const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)

        let totalTVL = 0


        switch (id) {
            case 0:
                const balanceWFTM = await contractWFTM.methods.balanceOf("0xca08C87466319F58660a439E46329D689718FefC").call()
                const balanceWFTMFormatted = await web3Default.utils.fromWei(balanceWFTM)
                let pool0TVL = parseFloat(balanceWFTMFormatted) * 2 * FTMPrice
                const prettyTVL0 = pool0TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL0)
                break;
            case 1:
                const balanceCasper = await contractCASPER.methods.balanceOf("0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74").call()
                let pool1TVL = parseFloat(web3Default.utils.fromWei(balanceCasper)) * CasperPrice
                const prettyTVL1 = pool1TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL1)
                break;
            case 2:
                const balanceUSDC = await contractUSDC.methods.balanceOf("0xdEA1B59D5749A22F768C2E1FD62557D05D45D0C2").call()
                const balanceUSDCFormatted = 1000000000000 * parseFloat(web3Default.utils.fromWei(balanceUSDC))
                let pool2TVL = balanceUSDCFormatted * 2
                const prettyTVL2 = pool2TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL2)
                break;
            case 3:
                const balanceWFTMMasterchef = await contractWFTM.methods.balanceOf("0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74").call()
                const pool3TVL = parseFloat(web3Default.utils.fromWei(balanceWFTMMasterchef)) * FTMPrice
                const prettyTVL3 = pool3TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL3)
                break;

        }



    }
    getTVL()

    const getPendingRewards = async () => {
        let pending = 0
        if (wallet.account) {
            for (let pid = 0; pid < 4; pid++) {
                const pendingReward = await contract.methods.pendingCASPER(pid, wallet.account).call()
                pending += pendingReward
            }
        }
        return pending
    }




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
