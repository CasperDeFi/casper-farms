import axios from 'axios'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { fromWei } from 'web3-utils'
import Pool from '../components/Pool'
import pools from '../data/pools.json'
import useTVL from '../helpers/useTVL'

import getTotalReward from '../helpers/getPendingRewards'

const people = [
    { key: 'Durward Reynolds', value: false },
    { key: 'Kenton Towne', value: false },
    { key: 'Therese Wunsch', value: false },
    { key: 'Benedict Kessler', value: true },
    { key: 'Katelyn Rohan', value: false }
]

export async function getServerSideProps(context) {
    try {
        const { data } = await axios.get('Https://api.casperdefi.com/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345?chainId=250&exchange=spirit')
        return { props: { query: context.query, casperPrice: data.data.token.priceUSD } }
    } catch {
        return { props: { query: context.query, casperPrice: 'loading' } }
    }
}


export default function IndexPage({ query, casperPrice }) {
    const wallet = useWallet()
    const router = useRouter()


    useEffect(() => {
        try {
            if (window.ethereum) {
                wallet.connect()
            }
        } catch { }
    }, [])

    const [chain, setChain] = useState(query?.chain?.[0] || 'FTM')
    const [showChainPicker, setShowChainPicker] = useState(false)
    const [selectedPerson, setSelectedPerson] = useState(people[0])
    const [tvl, setTvl] = useState('loading')
    const [pendingCasper, setPendingCasper] = useState('0')
    const [pendingCasperUSD, setPendingCasperUSD] = useState('Coming Soon')
    const [userDepositUSD, setUserDepositUSD] = useState('Coming Soon')

    useEffect(() => {
        router.push(`/${chain}`, undefined, { shallow: true })
    }, [chain])

    const getTVL = async () => {
        const temp = await useTVL()
        // setTvl(temp.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
        setTvl("Please Withdraw From Farms")

        // if(wallet.account){
        //     const rewardTotal = await getTotalReward()
        //     setPendingCasper(rewardTotal)
        // }
    }
    getTVL()

    const addCasperToMM = async () => {

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: "0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345", // The address that the token is at.
                        symbol: "CASPER", // A ticker symbol or shorthand, up to 5 chars.
                        decimals: 18, // The number of decimals in the token
                        image: "https://i.imgur.com/Pb0k9Sw.png", // A string url of the token logo
                    },
                },
            });
        } catch (error) { console.log(error) }
    }

    return (
        <>
            {/* <ChainPicker open={showChainPicker} onClose={() => setShowChainPicker(false)} {...{ chain, setChain }} /> */}

            <div className="fixed z-10 w-full">
                <div className="bg-purple-900 bg-opacity-50 p-2">
                    <div className="max-w-7xl mx-auto text-xs">
                        <p className="font-medium">Warning: CasperDefi is in beta and has risks of loss. Do your own research before using any of the tools available on CasperDefi.</p>
                    </div>
                </div>
                <div className="p-6 flex items-center space-x-4">
                    <a href="">
                        <img className="w-12" src="/img/casper-money.svg" alt="" />
                    </a>
                    <div className="flex-1" />
                    {/* <button onClick={() => setShowChainPicker((_) => !_)} type="button" className="w-6 h-6 grid place-items-center bg-white rounded-full shadow-2xl animate-spin">
                        <i className="fas fa-link text-black" />
                    </button> */}
                    <button onClick={() => wallet.connect()} type="button" className="border-2 rounded-full px-2 md:px-4 py-1 md:py-2 text-xs md:text-xl border-white shadow-2xl bg-black bg-opacity-90">
                        {wallet.account ? `${wallet?.account?.slice(0, 6)}...${wallet?.account?.slice(-6)}` : 'Connect Wallet'}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 py-12 md:p-12 md:py-24 space-y-12">
                <div>
                    <motion.img animate={{ y: ['0%', '2%', '0%'] }} transition={{ loop: Infinity, duration: 2 }} className="w-64 mx-auto" src="/img/casper-farms.svg" alt="" />
                </div>

                <div className="text-center space-y-2">
                    <p className="text-4xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 via-pink-400 to-blue-500">{tvl}</p>
                    <p className="font-extended uppercase">Total Value Locked</p>
                    <p className="text-1xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 via-green-400 to-blue-500">CASPER Token: ${parseFloat(casperPrice).toFixed(2)}</p>
                    <p>
                        <a
                            href=""
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono opacity-50 text-xs underline hover:no-underline"
                        >
                            DO NOT Purchase Casper
                        </a>
                    </p>
                    <p onClick={()=> addCasperToMM() } style={{cursor: 'pointer'}} className="font-mono opacity-50 text-xs underline hover:no-underline">Add To MetaMask</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black bg-opacity-25 rounded-xl border border-yellow-400 shadow-2xl p-6 py-12 flex items-center justify-center space-x-6">
                        <img className="block h-32" src="/img/casper-money.svg" alt="" />
                        <div>
                            <p className="font-extended uppercase">My Total Deposit</p>
                            <p className="font-mono opacity-50 text-xl">~{pendingCasperUSD}</p>
                            {/* <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 via-pink-400 to-blue-500">{userDepositUSD}</p> */}
                        </div>
                    </div>
                    <div className="bg-black bg-opacity-25 rounded-xl border border-yellow-400 shadow-2xl p-6 py-12 flex items-center justify-center space-x-6">
                        <img className="block h-32" src="/img/casper-money.svg" alt="" />
                        <div>
                            <p className="font-extended uppercase">Pending Rewards</p>
                            {/* <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 via-pink-400 to-blue-500">{pendingCasper ? pendingCasper : 0} CASPER</p> */}
                            {/* <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-indigo-400 via-pink-400 to-blue-500">{pendingCasper}</p> */}
                            <p className="font-mono opacity-50 text-xl">~{pendingCasperUSD}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {pools.map((pool) => (
                        <Pool pool={pool} key={pool.id} />
                    ))}
                </div>

                <div  className="text-center">
                    <p className="text-2xl font-mono font-extrabold md:text-4xl opacity-25">Powered by CasperDefi</p>
                </div>
            </div>
        </>
    )
}
