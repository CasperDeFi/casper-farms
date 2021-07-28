import '../styles/global.css'
import Head from 'next/head'
import { UseWalletProvider } from 'use-wallet'
import { GeistProvider, CssBaseline } from '@geist-ui/react'

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                    integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
                <link rel="shortcut icon" href="/img/casper.png" />
                <title>Casper Farms</title>
                <script data-token="8NMB7FECTW1K" async src="https://cdn.splitbee.io/sb.js"></script>
            </Head>
            <GeistProvider>
            <UseWalletProvider chainId={250}>
                <Component {...pageProps} />
            </UseWalletProvider>
            </GeistProvider>
        </>
    )
}
