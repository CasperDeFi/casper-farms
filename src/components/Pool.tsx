import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fromWei } from 'web3-utils'
import useFarms from '../hooks/useFarms'

export default function Pool({ pool }) {
    const { status, web3, data, withdraw, deposit, harvest } = useFarms(pool.slug)

    const { tvl, balance } = data

    useEffect(() => console.log(data), [data])

    const [open, setOpen] = useState(false)

    const [depositInput, setDepositInput] = useState('')
    const [withdrawInput, setWithdrawInput] = useState('')

    return (
        <div onClick={() => setOpen((_) => !_)} type="button" className="relative block w-full text-left rounded-xl border border-purple-900 p-6 shadow-2xl">
            {/* {status} */}
            {status === 'loading' && (
                <div className="absolute top-0 right-0 p-6">
                    <img className={classNames('w-6 animate-spin')} src="/img/casper.png" alt="" />
                </div>
            )}
            <div className="flex flex-gap-6 md:flex-gap-12 flex-wrap items-center">
                <div className="rounded-2xl shadow-2xl h-20 w-20 bg-center bg-cover" style={{ backgroundImage: `url("${pool.img}")` }} />
                <div>
                    <p className="font-extended">{pool.name}</p>
                    <div className="flex flex-gap-6">
                        <div className="space-y-1">
                            <p className="text-2xl font-extrabold">{parseFloat(fromWei(balance.toString())).toFixed(2)}</p>
                            <p className="uppercase text-xs font-extended opacity-50">Balance</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-extrabold">{data?.userInfo?.amount ? fromWei(data?.userInfo?.amount) : 'XX'}</p>
                            <p className="uppercase text-xs font-extended opacity-50">Deposited</p>
                        </div>
                    </div>
                </div>
                <p />
                <div className="space-y-1">
                    <p className="text-4xl font-extrabold">666%</p>
                    <p className="uppercase font-extended opacity-50 text-sm">Yearly</p>
                </div>
                <div className="space-y-1">
                    <p className="text-4xl font-extrabold">2.1%</p>
                    <p className="uppercase font-extended opacity-50 text-sm">Daily</p>
                </div>
                <div className="space-y-1">
                    <p className="text-4xl font-extrabold">{fromWei(tvl.toString())}</p>
                    <p className="uppercase font-extended opacity-50 text-sm">TVL</p>
                </div>
                <div className="flex-1" />
                <div className="space-x-2">
                    <button type="button" className="bg-purple-500 rounded-2xl text-purple-200 text-2xl py-2 px-6 shadow-2xl">
                        Harvest
                    </button>
                    <button type="button" className="bg-purple-500 rounded-2xl text-purple-200 text-2xl py-2 px-6 shadow-2xl">
                        <i className={classNames('fas fa-arrow-down transition ease-in-out transform', open && '-rotate-180')} />
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div onClick={(e) => e.stopPropagation()} className="overflow-hidden" initial={{ height: '0' }} animate={{ height: 'auto' }} exit={{ height: '0' }}>
                        <div className="h-6" />
                        <div className="border border-purple-900 rounded-xl overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        deposit(web3.utils.toWei(depositInput))
                                    }}
                                    className="border-b md:border-b-0 md:border-r border-purple-900 p-6 space-y-4"
                                >
                                    <p className="font-extended uppercase">Deposit</p>
                                    <img className="w-16 mx-auto" src="/img/vault-icon.svg" alt="" />
                                    <div className="border border-purple-800 rounded shadow-inner flex items-center">
                                        <input value={depositInput} onChange={(e) => setDepositInput(e.target.value)} placeholder="0.00" className="w-full flex-1 bg-transparent p-2" type="number" />
                                        <div className="p-2">
                                            <button
                                                onClick={() => setDepositInput(fromWei(balance.toString()))}
                                                type="button"
                                                className="bg-purple-800 text-purple-200 px-2 py-1 rounded text-xs uppercase font-mono"
                                            >
                                                Max
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            disabled={!depositInput}
                                            type="submit"
                                            className={classNames('w-full bg-purple-500 rounded text-purple-200 py-1 px-2 font-medium shadow-2xl', !depositInput && 'opacity-50 cursor-not-allowed')}
                                        >
                                            Deposit to Vault
                                        </button>
                                    </div>
                                </form>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        withdraw(web3.utils.toWei(withdrawInput))
                                    }}
                                    className="border-b md:border-b-0 md:border-r border-purple-900 p-6 space-y-4"
                                >
                                    <p className="font-extended uppercase">Withdraw</p>
                                    <img className="w-16 mx-auto" src="/img/wallet-icon.svg" alt="" />
                                    <div className="border border-purple-800 rounded shadow-inner flex items-center">
                                        <input value={withdrawInput} onChange={(e) => setWithdrawInput(e.target.value)} placeholder="0.00" className="w-full flex-1 bg-transparent p-2" type="number" />
                                        {data?.userInfo?.amount && (
                                            <div className="p-2">
                                                <button
                                                    onClick={() => setWithdrawInput(fromWei(data?.userInfo?.amount))}
                                                    type="button"
                                                    className="bg-purple-800 text-purple-200 px-2 py-1 rounded text-xs uppercase font-mono"
                                                >
                                                    Max
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            disabled={!withdrawInput}
                                            type="submit"
                                            className={classNames('w-full bg-purple-500 rounded text-purple-200 py-1 px-2 font-medium shadow-2xl', !withdrawInput && 'opacity-50 cursor-not-allowed')}
                                        >
                                            Withdraw from Vault
                                        </button>
                                    </div>
                                </form>
                                <div className=" p-6 space-y-4 flex flex-col">
                                    <p className="font-extended uppercase">Harvest</p>
                                    <div className="flex items-center space-x-4">
                                        <img className="w-16" src="/img/casper-money.svg" alt="" />
                                        <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 via-yellow-400 to-green-500">{data?.userInfo?.rewardDebt || 'XX'}</p>
                                    </div>
                                    <div className="flex-1" />
                                    <div>
                                        <button onClick={harvest} type="button" className="w-full bg-purple-500 rounded text-purple-200 py-1 px-2 font-medium shadow-2xl">
                                            Harvest Rewards
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
