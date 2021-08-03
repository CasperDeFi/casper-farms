import Web3 from 'web3'
import tokenAbi from '../data/token-abi.json'
import axios from 'axios'


export default async function useTVL() {
    let tvl = 0

    const web3Default = new Web3('Https://rpc.ftm.tools')


    const casperMasterChef = "0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74"

    const casperFTMLPAddress = "0xca08C87466319F58660a439E46329D689718FefC"
    const casperSpiritLPAddress = "0x9f5182fEfA4092cA11F9DBeb383f314B6D3381D0"
    const casperGrimLPAddress = "0xC6Ec0bd31BC934addd12d587b48455F2b25BcACB"
    const spiritAddress = "0x5cc61a78f164885776aa610fb0fe1257df78e59b"
    const usdcAddress = "0x04068da6c83afcfa0e13ba15a6696662335d5b75"
    const tombAddress = "0x6c021ae822bea943b2e66552bde1d2696a53fbb7"
    const tbondAddress = "0x24248cd1747348bdc971a5395f4b3cd7fee94ea0"
    const casperIFUSDLPAddress = "0x7D07d48EdC24a35ad071e726541dBA96D8A57C55"

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
        const { data } = await axios.get('https://cors-anywhere.herokuapp.com/https://api.casperdefi.com/v1/tokens/0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345?chainId=250&exchange=spirit')
        CasperPrice = parseFloat(data.data.token.priceUSD).toFixed(5)
    }catch{}

    const contractSpirit = new web3Default.eth.Contract(tokenAbi as any, spiritAddress)
    let spiritPrice;
    try{
        const { data } = await axios.get('https://cors-anywhere.herokuapp.com/https://api.casperdefi.com/v1/tokens/0x5cc61a78f164885776aa610fb0fe1257df78e59b?chainId=250&exchange=spirit')
        spiritPrice = parseFloat(data.data.token.priceUSD).toFixed(5)
    }catch{}


    const tombPriceRequest = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tomb&vs_currencies=usd')
    const tombPriceResponse = await tombPriceRequest.json()
    const tombPrice = tombPriceResponse['tomb'].usd

    const contractUSDC = new web3Default.eth.Contract(tokenAbi as any, usdcAddress)
    const contractPool0 = new web3Default.eth.Contract(tokenAbi as any, '0xca08C87466319F58660a439E46329D689718FefC')
    const contractPool5 = new web3Default.eth.Contract(tokenAbi as any, casperSpiritLPAddress)
    const contractPool6 = new web3Default.eth.Contract(tokenAbi as any, casperGrimLPAddress)
    const contractPool8 = new web3Default.eth.Contract(tokenAbi as any, casperIFUSDLPAddress)


    const contractTomb = new web3Default.eth.Contract(tokenAbi as any, tombAddress)
    const contractTbond = new web3Default.eth.Contract(tokenAbi as any, tbondAddress)

    const balancePool0 = await contractPool0.methods.balanceOf('0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74').call()
    const totalSupply = await contractPool0.methods.totalSupply().call()
    const balanceWFTM = await contractWFTM.methods.balanceOf('0xca08C87466319F58660a439E46329D689718FefC').call()
    const balanceWFTMFormatted = web3Default.utils.fromWei(balanceWFTM)
    const ratio = balancePool0 / totalSupply
    const pool0TVL = parseFloat(balanceWFTMFormatted) * ratio * 2 * FTMPrice

    const balanceCasper = await contractCASPER.methods.balanceOf('0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74').call()
    const pool1TVL = parseFloat(web3Default.utils.fromWei(balanceCasper)) * CasperPrice

    const balanceUSDC = await contractUSDC.methods.balanceOf('0xdEA1B59D5749A22F768C2E1FD62557D05D45D0C2').call()
    const balanceUSDCFormatted = 1000000000000 * parseFloat(web3Default.utils.fromWei(balanceUSDC))
    const pool2TVL = balanceUSDCFormatted * 2

    const balanceWFTMMasterchef = await contractWFTM.methods.balanceOf('0xaD580d9b5C9c043325b3D8C33B1166B8f8E93E74').call()
    const pool3TVL = parseFloat(web3Default.utils.fromWei(balanceWFTMMasterchef)) * FTMPrice

    const balanceUSDCMasterchef = await contractUSDC.methods.balanceOf(casperMasterChef).call()
    const pool4TVL = 1000000000000 * parseFloat(web3Default.utils.fromWei(balanceUSDCMasterchef))

    const balancePool5 = await contractPool5.methods.balanceOf(casperMasterChef).call()
    const totalSupply5 = await contractPool5.methods.totalSupply().call()
    const balanceCasper5 = await contractCASPER.methods.balanceOf(casperSpiritLPAddress).call()
    const balanceCasperFormatted = web3Default.utils.fromWei(balanceCasper5)
    const ratio5 = balancePool5 / totalSupply5
    const pool5TVL = parseFloat(balanceCasperFormatted) * ratio5 * 2 * CasperPrice


    const balancePool6 = await contractPool6.methods.balanceOf(casperMasterChef).call()
    const totalSupply6 = await contractPool6.methods.totalSupply().call()
    const balanceCasper6 = await contractCASPER.methods.balanceOf(casperGrimLPAddress).call()
    const balanceCasperFormatted6 = web3Default.utils.fromWei(balanceCasper6)
    const ratio6 = balancePool6 / totalSupply6
    const pool6TVL = parseFloat(balanceCasperFormatted6) * ratio6 * 2 * CasperPrice


    const balanceSpiritMasterchef = await contractSpirit.methods.balanceOf(casperMasterChef).call()
    const pool7TVL = parseFloat(web3Default.utils.fromWei(balanceSpiritMasterchef)) * spiritPrice

    const balancePool8 = await contractPool8.methods.balanceOf(casperMasterChef).call()
    const totalSupply8 = await contractPool8.methods.totalSupply().call()
    // console.log('total', balancePool8)
    const balanceCasper8 = await contractCASPER.methods.balanceOf(casperIFUSDLPAddress).call()
    const balanceCasperFormatted8 = web3Default.utils.fromWei(balanceCasper8)
    const ratio8 = balancePool8 / totalSupply8
    // console.log('pool8',balanceCasperFormatted8)
    const pool8TVL = parseFloat(balanceCasperFormatted8) * ratio8 * 2 * CasperPrice

    const balanceTbond = await contractTbond.methods.balanceOf(casperMasterChef).call()
    const pool9TVL = parseFloat(web3Default.utils.fromWei(balanceTbond)) * Math.sqrt(tombPrice)


    tvl = pool0TVL + pool1TVL + pool2TVL + pool3TVL + pool4TVL + pool5TVL + pool6TVL + pool7TVL + pool8TVL + pool9TVL
    tvl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })


    return tvl
}
