import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

function App() {
  let provider = undefined;
  let signer = undefined;

  const [tokenName, setTokenName] = useState("NULL");
  const [inputAddress,setInputAddress] = useState();
  const [erc20_r, setErc20_r] = useState();
  const [erc20_w, setErc20_w] = useState();

    //초기 동작 메타마스크 자동 실행
    useEffect(() => {
      connect();
    }, []);

    const connect = async() =>{
      if(window.ethereum){
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        //abi 가져오기
        const artifact = require("./contracts/MyToken.json");
        const { abi } = artifact;
        const contractAddress = "0xa2920862B60BBEf8727287499DeBa9AB6FdC86D6";

        //read 전용
        setErc20_r(new ethers.Contract(contractAddress, abi, provider));
        
        //read, write 전용
        setErc20_w(new ethers.Contract(contractAddress, abi, signer)); 
        
      }else{
        alert("Metamask install please")
        window.location.href = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      }
    }
    const myTokenGetClick = async() =>{
      setTokenName(await erc20_r.symbol());
    }

    const transformClick = async() =>{
      // Each mtt has 18 decimal places
      // 단위 변경
      const mtt = ethers.utils.parseUnits("1.0", 18);

      const tx = erc20_w.transfer(inputAddress, mtt);
    }

    const handleChange = (e) => { 
      setInputAddress(e.target.value);
    };

  return (
    
    <div className="App">
      <header className="App-header">
          ETH TEST
      </header>
      <body>
      <br/>
        <label>토큰정보 : {tokenName} </label>
      <button onClick={myTokenGetClick}>발행한 토큰 정보 가져오기</button>
      <br/>
      <label>전송할 주소 </label><input type="text" onChange={handleChange} value={inputAddress}></input> <button onClick={transformClick}>전송</button>
      </body>
    </div>
  );
}

export default App;
