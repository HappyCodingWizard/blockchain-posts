  import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'grizzyrp';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  
  const [walletAddress, setWalletAddress] = useState(null);
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window

      if(solana){
        if(solana.isPhantom) {
          console.log('Phantom wallet found!')
          const response = await solana.connect({ onlyIfTrusted: true})
          console.log('Connected with Public Key',
            response.publicKey.toString())

          setWalletAddress(response.publicKey.toString())
        }
      } else {
        console.log('Solana object not found')
      }
    } catch(e) {
      console.error(e)
    }
  }

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )

  const getSplBalance = async () => {
    const response = await axios({
      url: `https://api.mainnet-beta.solana.com`,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: [
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
              walletAddress,
              {
                mint: tokenMintAddress,
              },
              {
                encoding: "jsonParsed",
              },
            ],
          },
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
              walletAddress2,
              {
                mint: 
                  'HMhTehXd6CXBt2YhrAhWwmUZbZoTGoBFP2LgRtKz8dJq',
              },
              {
                encoding: "jsonParsed",
              },
            ],
          },
      ]
  })
  }
  
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])
  
  return (
    <div className="App"> 
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">NFT Portal</p>
          <p className="sub-text">
            View your NFT collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
