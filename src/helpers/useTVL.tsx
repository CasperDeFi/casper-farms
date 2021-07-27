import Web3 from "web3"
import tokenAbi from '../data/token-abi.json'

export default async function useTVL() {
    let tvl = 0

    let web3Default = new Web3("Https://rpc.ftm.tools")

    const contractWFTM = new web3Default.eth.Contract(tokenAbi as any, "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83")
    const FTMPriceRequest = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd')
    const FTMPriceResponse = await FTMPriceRequest.json()
    const FTMPrice = FTMPriceResponse["fantom"]["usd"]

    const contractCASPER = new web3Default.eth.Contract(tokenAbi as any, "0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345")
    const CasperPriceRequest = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=casper-defi&vs_currencies=usd")
    const CasperPriceResponse = await CasperPriceRequest.json()
    const CasperPrice = CasperPriceResponse["casper-defi"]["usd"]

    const contractUSDC = new web3Default.eth.Contract(tokenAbi as any, "0x04068da6c83afcfa0e13ba15a6696662335d5b75")
    const contractPool0 = new web3Default.eth.Contract(tokenAbi as any, "0xca08C87466319F58660a439E46329D689718FefC")

    const balancePool0 = await contractPool0.methods.balanceOf("0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74").call()
    const totalSupply = await contractPool0.methods.totalSupply().call()
    const balanceWFTM = await contractWFTM.methods.balanceOf("0xca08C87466319F58660a439E46329D689718FefC").call()
    const balanceWFTMFormatted =  web3Default.utils.fromWei(balanceWFTM)
    const ratio = balancePool0 / totalSupply
    const pool0TVL = parseFloat(balanceWFTMFormatted) * ratio * 2 * FTMPrice

    const balanceCasper = await contractCASPER.methods.balanceOf("0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74").call()
    const pool1TVL = parseFloat(web3Default.utils.fromWei(balanceCasper)) * CasperPrice

    const balanceUSDC = await contractUSDC.methods.balanceOf("0xdEA1B59D5749A22F768C2E1FD62557D05D45D0C2").call()
    const balanceUSDCFormatted = 1000000000000 * parseFloat(web3Default.utils.fromWei(balanceUSDC))
    const pool2TVL = balanceUSDCFormatted * 2

    const balanceWFTMMasterchef = await contractWFTM.methods.balanceOf("0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74").call()
    const pool3TVL = parseFloat(web3Default.utils.fromWei(balanceWFTMMasterchef)) * FTMPrice

    tvl = pool0TVL + pool1TVL + pool2TVL + pool3TVL
    tvl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    return tvl
}