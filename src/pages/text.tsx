function Page({ price }) {
    return <div>Casper Price: {price}</div>
}

Page.getInitialProps = async (ctx) => {
    const res = await fetch('https://api.casperdefi.com/v1/tokens/0xC30d1b0Ce932C3dd3373a2C23aDA4E9608CAf345?chainId=250&exchange=spirit')
    const json = await res.json()
    return { price: Math.round(json.data.token.priceUSD * 100) / 100 }
}

export default Page
