import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

function App() {
  let provider = undefined;
  let signer = undefined;

  const [tokenName, setTokenName] = useState("NULL");
  
  const [erc20_r, setErc20_r] = useState();
  const [erc20_w, setErc20_w] = useState();

  const [erc721_r, setErc721_r] = useState();
  const [erc721_w, setErc721_w] = useState();

  const [inputs, setInputs] = useState({
    inputErc20Address: '',
    inputErc721Address: '',
    inputMeta: ''
  });

  const { inputErc20Address, inputErc721Address, inputMeta } = inputs; // 비구조화 할당을 통해 값 추출

  //초기 동작 메타마스크 자동 실행
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();

      //ERC-20 정보 가져오기
      const erc20Artifact = require("./contracts/MyToken.json");
      const erc20Abi = erc20Artifact.abi;
      const erc20ContractAddress = "0x842D06975A0d2a772A6Fd2484529A6c5B47A2cb8";

      //ERC-721 정보 가져오기
      const erc721Artifact = require("./contracts/MyNFT.json");
      const erc721Abi = erc721Artifact.abi;
      const erc721ContractAddress = "0x78A361125Aec60d51784C64B15bA7BCe266eA37B";

      //read 전용
      setErc20_r(new ethers.Contract(erc20ContractAddress, erc20Abi, provider));
      //read, write 전용
      setErc20_w(new ethers.Contract(erc20ContractAddress, erc20Abi, signer));

            //read 전용
      setErc721_r(new ethers.Contract(erc721ContractAddress, erc721Abi, provider));
      //read, write 전용
      setErc721_w(new ethers.Contract(erc721ContractAddress, erc721Abi, signer));
    } else {
      alert("Metamask install please");
      window.location.href =
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
    }
  };

  //토큰명 받아오기
  const myTokenGetClick = async () => {
    setTokenName(await erc20_r.symbol());
  };

  //토큰 전송
  const transformClick = async () => {

    // Each mtt has 18 decimal places
    // 단위 변경
    const mtt = ethers.utils.parseUnits("1.0", 18);

    const tx = erc20_w.transfer(inputErc20Address, mtt);
  };

  //Mint NFT
  const mintClick = async () => {

    const tx = erc721_w.mintNFT(inputErc721Address, inputMeta);
  };

  const handleChange = (e) => {
    const { value, name } = e.target; 
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <div className="App">
      <header className="App-header">ETH TEST</header>
      <body>
        <br />
        <label>토큰정보 : {tokenName} </label>
        <button onClick={myTokenGetClick}>발행한 토큰 정보 가져오기</button>
        <br />
        <label>전송할 주소 </label>
        <input
          type="text"
          name= "inputErc20Address"
          onChange={handleChange}
          value={inputErc20Address}
        ></input>
        <button onClick={transformClick}>전송</button>
        <br />
        <br />
        <label>Minting NFT</label>
        <br />
        <label>NFT Metadata: </label>
        <input
          type="text"
          name= "inputMeta"
          onChange={handleChange}
          value={inputMeta}
        ></input>
        <br/>
        <label>전송할 주소 </label>
        <input
          type="text"
          name= "inputErc721Address"
          onChange={handleChange}
          value={inputErc721Address}
        ></input>
        <button onClick={mintClick}>전송</button>
      </body>
    </div>
  );
}

export default App;
