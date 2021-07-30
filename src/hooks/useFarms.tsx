import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import pools from '../data/pools.json'
import tokenAbi from '../data/token-abi.json'
import poolAbi from '../data/pool-abi.json'
import axios from 'axios'


export default function useFarms(slug) {
    const wallet = useWallet()
    const web3 = new Web3(wallet.ethereum)


    const POOL_CONTRACT_ADDRESS = '0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74'

    const [balance, setBalance] = useState(0)
    const [status, setStatus] = useState('loading')
    const [poolInfo, setPoolInfo] = useState({})
    const [userInfo, setUserInfo] = useState({})
    const [pendingCASPER, setPendingCASPER] = useState('-')
    const [allowance, setAllowance] = useState(0)
    const [yearlyAPR, setYearlyAPR] = useState('loading')
    const [dailyAPR, setDailyAPR] = useState('loading')
    const [pending, setPending] = useState(0)

    const [tvl, setTvl] = useState('0')

    const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)

    const pool = pools.find((pool) => pool.slug === slug)
    const { id } = pool


    const approve = async (amount) => {
        // @ts-ignore
        const token = poolInfo?.lpToken

        if (!token) return

        // @ts-ignore
        const tokenContract = new web3.eth.Contract(tokenAbi as any, poolInfo?.lpToken)

        if (amount > allowance) {
            const maxAllowance = web3.utils.toWei('999999999999')
            await tokenContract.methods.approve(POOL_CONTRACT_ADDRESS, maxAllowance).send({ from: wallet.account })
            setAllowance(999999999999)
            if(id == 4){
                setAllowance(9999999999)
            }
        }
    }

    const loadData = async () => {
        if (!wallet.account) return
        setStatus('loading')
        try {
            let userInfoFromWeb3 = await contract.methods.userInfo(id, wallet.account).call()
            let usdc = userInfoFromWeb3.amount

            if(id ==4 ){
                userInfoFromWeb3.amount = web3.utils.toWei(usdc, 'micro')
            }
            setUserInfo(userInfoFromWeb3)

            let pendingRewards = await contract.methods.pendingCASPER(id, wallet.account).call()
            setPendingCASPER(pendingRewards)

        } catch (error) {
            console.log(error)
        }

        try {
            const poolInfoFromWeb3 = await contract.methods.poolInfo(id).call()
            setPoolInfo(poolInfoFromWeb3)
            // console.log('info', id, poolInfoFromWeb3)

            const tokenContract = new web3.eth.Contract(tokenAbi as any, poolInfoFromWeb3.lpToken)

            let balanceFromWeb3 = await tokenContract.methods.balanceOf(wallet.account).call()

            if (id == 4){
                balanceFromWeb3 = web3.utils.toWei(balanceFromWeb3, 'micro')
            }
            setBalance(balanceFromWeb3)

            const allowanceFromWeb3 = await tokenContract.methods.allowance(wallet.account, POOL_CONTRACT_ADDRESS).call()
            setAllowance(allowanceFromWeb3)

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
        const web3Default = new Web3('Https://rpc.ftm.tools')

        const casperMasterChef = "0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74"

        const casperFTMLPAddress = "0xca08C87466319F58660a439E46329D689718FefC"
        const casperSpiritLPAddress = "0x9f5182fEfA4092cA11F9DBeb383f314B6D3381D0"
        const casperGrimLPAddress = "0xC6Ec0bd31BC934addd12d587b48455F2b25BcACB"
        const spiritAddress = "0x5cc61a78f164885776aa610fb0fe1257df78e59b"
        const usdcAddress = "0x04068da6c83afcfa0e13ba15a6696662335d5b75"

        const contractWFTM = new web3Default.eth.Contract(tokenAbi as any, '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83')
        let wftmPrice
        try{
            const { data } = await axios.get('https://cors-anywhere.herokuapp.com/https://api.casperdefi.com/v1/tokens/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83?chainId=250&exchange=spirit')
            wftmPrice = parseFloat(data.data.token.priceUSD).toFixed(5)
        }catch{}
        const FTMPrice = wftmPrice

        const contractCASPER = new web3Default.eth.Contract(tokenAbi as any, '0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345')
        let CasperPrice
        try{
            const { data } = await axios.get('https://api.casperdefi.com/v1/tokens/0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345?chainId=250&exchange=spirit')
            CasperPrice = parseFloat(data.data.token.priceUSD).toFixed(5)
        }catch{}
        
        const contractSpirit = new web3Default.eth.Contract(tokenAbi as any, spiritAddress)
        let spiritPrice;
        try{
            const { data } = await axios.get('https://api.casperdefi.com/v1/tokens/0x5cc61a78f164885776aa610fb0fe1257df78e59b?chainId=250&exchange=spirit')
            spiritPrice = parseFloat(data.data.token.priceUSD).toFixed(5)
        }catch{}

        const contractUSDC = new web3Default.eth.Contract(tokenAbi as any, usdcAddress)
        const contractPool0 = new web3Default.eth.Contract(tokenAbi as any, '0xca08C87466319F58660a439E46329D689718FefC')
        const contractPool5 = new web3Default.eth.Contract(tokenAbi as any, casperSpiritLPAddress)
        const contractPool6 = new web3Default.eth.Contract(tokenAbi as any, casperGrimLPAddress)

        const chad = new web3.eth.Contract(poolAbi as any, '0xDA094Ee6bDaf65c911f72FEBfC58002e5e2656d1')

        const contract = new web3.eth.Contract(poolAbi as any, POOL_CONTRACT_ADDRESS)



        switch (id) {
            // case 0:
            //     const balanceWFTM = await contractWFTM.methods.balanceOf("0xca08C87466319F58660a439E46329D689718FefC").call()
            //     const balanceWFTMFormatted = await web3Default.utils.fromWei(balanceWFTM)
            //     let pool0TVL = parseFloat(balanceWFTMFormatted) * 2 * FTMPrice
            //     const prettyTVL0 = pool0TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            //     setTvl(prettyTVL0)
            //     break;
            case 0:
                const balancePool0 = await contractPool0.methods.balanceOf(casperMasterChef).call()
                const totalSupply = await contractPool0.methods.totalSupply().call()
                const balanceWFTM = await contractWFTM.methods.balanceOf('0xca08C87466319F58660a439E46329D689718FefC').call()
                const balanceWFTMFormatted = web3Default.utils.fromWei(balanceWFTM)
                const ratio = balancePool0 / totalSupply
                const LPWorth = parseFloat(balanceWFTMFormatted) * ratio * 2 * FTMPrice
                const totalSupplyFormatted = web3Default.utils.fromWei(totalSupply)
                const prettyTVL0 = LPWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL0)
                const yearly = (106902 * CasperPrice / LPWorth * 100)
                const daily = yearly / 356
                const yearlyFormatted = yearly.toFixed().toLocaleString()
                const dailyFormatted = daily.toFixed(2).toLocaleString()
                setYearlyAPR(yearlyFormatted)
                setDailyAPR(dailyFormatted)
                break

            case 1:
                const balanceCasper = await contractCASPER.methods.balanceOf(casperMasterChef).call()
                const pool1TVL = parseFloat(web3Default.utils.fromWei(balanceCasper)) * CasperPrice
                const prettyTVL1 = pool1TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL1)

                const yearly1 = (85521 * CasperPrice / pool1TVL * 100)
                const daily1 = yearly1 / 356
                const yearlyFormatted1 = yearly1.toFixed().toLocaleString()
                const dailyFormatted1 = daily1.toLocaleString()
                setYearlyAPR(yearlyFormatted1)
                setDailyAPR(dailyFormatted1)

                break
            case 2:
                const balanceUSDC = await contractUSDC.methods.balanceOf('0xdEA1B59D5749A22F768C2E1FD62557D05D45D0C2').call()
                const balanceUSDCFormatted = 1000000000000 * parseFloat(web3Default.utils.fromWei(balanceUSDC))
                const pool2TVL = parseFloat((balanceUSDCFormatted * 2).toFixed())
                const prettyTVL2 = pool2TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL2)

                const yearly2 = (117592 * CasperPrice / pool2TVL * 100)
                const daily2 = yearly2 / 356
                const yearlyFormatted2 = yearly2.toFixed().toLocaleString()
                const dailyFormatted2 = daily2.toFixed(2).toLocaleString()
                setYearlyAPR(yearlyFormatted2)
                setDailyAPR(dailyFormatted2)

                break
            case 3:
                const balanceWFTMMasterchef = await contractWFTM.methods.balanceOf(casperMasterChef).call()
                const pool3TVL = parseFloat(web3Default.utils.fromWei(balanceWFTMMasterchef)) * FTMPrice
                const prettyTVL3 = pool3TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL3)

                const yearly3 = (5345 * CasperPrice / pool3TVL * 100)
                const daily3 = yearly3 / 356
                const yearlyFormatted3 = yearly3.toFixed(2).toLocaleString()
                const dailyFormatted3 = daily3.toFixed(2).toLocaleString()
                setYearlyAPR(yearlyFormatted3)
                setDailyAPR(dailyFormatted3)

                break
            case 4:
                const balanceUSDCMasterchef = await contractUSDC.methods.balanceOf(casperMasterChef).call()
                const pool4TVL = 1000000000000 * parseFloat(web3Default.utils.fromWei(balanceUSDCMasterchef))
                const prettyTVL4 = pool4TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL4)

                const yearly4 = (5345 * CasperPrice / pool4TVL * 100)
                const daily4 = yearly4 / 356
                const yearlyFormatted4 = yearly4.toFixed(2).toLocaleString()
                const dailyFormatted4 = daily4.toFixed(2).toLocaleString()
                setYearlyAPR(yearlyFormatted4)
                setDailyAPR(dailyFormatted4)
                break;
            case 5:
                const balancePool5 = await contractPool5.methods.balanceOf(casperMasterChef).call()
                const totalSupply5 = await contractPool5.methods.totalSupply().call()
                const balanceCasper5 = await contractCASPER.methods.balanceOf(casperSpiritLPAddress).call()
                const balanceCasperFormatted = web3Default.utils.fromWei(balanceCasper5)
                const ratio5 = balancePool5 / totalSupply5
                const pool5TVL = parseFloat(balanceCasperFormatted) * ratio5 * 2 * CasperPrice
                const totalSupplyFormatted5 = web3Default.utils.fromWei(totalSupply5)
                const prettyTVL5 = pool5TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL5)
                const yearly5 = (106902 * CasperPrice / pool5TVL * 100)
                const daily5 = yearly5 / 356
                const yearlyFormatted5 = yearly5.toFixed().toLocaleString()
                const dailyFormatted5 = daily5.toFixed().toLocaleString()
                setYearlyAPR(yearlyFormatted5)
                setDailyAPR(dailyFormatted5)
                break
            case 6:
                const balancePool6 = await contractPool6.methods.balanceOf(casperMasterChef).call()
                const totalSupply6 = await contractPool6.methods.totalSupply().call()
                const balanceCasper6 = await contractCASPER.methods.balanceOf(casperGrimLPAddress).call()
                const balanceCasperFormatted6 = web3Default.utils.fromWei(balanceCasper6)
                const ratio6 = balancePool6 / totalSupply6
                const pool6TVL = parseFloat(balanceCasperFormatted6) * ratio6 * 2 * CasperPrice
                const totalSupplyFormatted6 = web3Default.utils.fromWei(totalSupply6)
                const prettyTVL6 = pool6TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL6)
                const yearly6 = (10690 * CasperPrice / pool6TVL * 100)
                const daily6 = yearly6 / 356
                const yearlyFormatted6 = yearly6.toFixed().toLocaleString()
                const dailyFormatted6 = daily6.toFixed(2).toLocaleString()
                setYearlyAPR(yearlyFormatted6)
                setDailyAPR(dailyFormatted6)
                break

            case 7:
                const balanceSpiritMasterchef = await contractSpirit.methods.balanceOf(casperMasterChef).call()
                const pool7TVL = parseFloat(web3Default.utils.fromWei(balanceSpiritMasterchef)) * spiritPrice
                const prettyTVL7 = pool7TVL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                setTvl(prettyTVL7)

                const yearly7 = (4276 * CasperPrice / pool7TVL * 100)
                const daily7 = yearly7 / 356
                const yearlyFormatted7 = yearly7.toFixed(2).toLocaleString()
                const dailyFormatted7 = daily7.toFixed(2).toLocaleString()
                setYearlyAPR(yearlyFormatted7)
                setDailyAPR(dailyFormatted7)

                break


        }
    }
    getTVL()

    const getPendingRewards = async () => {
        let pending = 0
        if (wallet.account) {
            for (let pid = 0; pid < 7; pid++) {
                const pendingReward = await contract.methods.pendingCASPER(pid, wallet.account).call()
                pending += pendingReward
            }
        }
        setPending(pending)
    }

    return {
        status,
        web3,
        contract,
        allowance,
        approve,
        data: {
            ...pool,
            poolInfo,
            userInfo,
            tvl,
            balance,
            dailyAPR,
            yearlyAPR,
            pendingCASPER,
            pending
        },
        deposit,
        withdraw,
        harvest
    }
}
