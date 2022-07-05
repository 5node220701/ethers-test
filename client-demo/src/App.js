import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
function App() {
  let provider = undefined;
  let signer = undefined;

  const [tokenName, setTokenName] = useState("NULL");
  const [inputAddress,setInputAddress] = useState();
  const [erc20, setErc20] = useState();
  const [erc20_rw,setErc20_rw] = useState();

    //초기 동작
    useEffect(() => {
      connect();
    }, []);

    const connect = async() =>{
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();

      //abi 가져오기
      const artifact = require("./contracts/MyToken.json");
      const { abi } = artifact;
      console.log(abi);
      const contractAddress = "0xa2920862B60BBEf8727287499DeBa9AB6FdC86D6";

      //read 전용
      console.log("SET")
      setErc20(new ethers.Contract(contractAddress, abi, provider));
      
      //read, write 전용
      setErc20_rw(new ethers.Contract(contractAddress, abi, signer)); 

    }
    const myTokenGetClick = async() =>{
      console.log(erc20);
      setTokenName(await erc20.symbol());
    }

    const transformClick = async() =>{
      // Each mtt has 18 decimal places
      const mtt = ethers.utils.parseUnits("1.0", 18);

      const tx = erc20_rw.transfer(inputAddress, mtt);
    }

    const handleChange = (e) => {  // <- input값으로 text 변경 함수
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
