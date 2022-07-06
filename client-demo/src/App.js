import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

function App() {
  let provider = undefined;
  let signer = undefined;

  const [tokenName, setTokenName] = useState("NULL");
  const [tokenCount, setTokenCount] = useState();
  const [userAddress, setUserAddress] = useState();

  const [erc20_r, setErc20_r] = useState();
  const [erc20_w, setErc20_w] = useState();

  const [erc721_r, setErc721_r] = useState();
  const [erc721_w, setErc721_w] = useState();
  const [myNftList, setMyNftList] = useState();
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
      const address = await signer.getAddress();
      console.log("TT"+address);
      setUserAddress(address);

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

  //내 토큰 정보받아오기
  const myTokenGetClick = async () => {
    setTokenName(await erc20_r.symbol());
    let data = await erc20_r.balanceOf(userAddress)
    console.log(data.toString())
    setTokenCount(data.toString());
  };

  //토큰 전송
  const transformClick = async () => {

    // Each mtt has 18 decimal places
    // 단위 변경
    const mtt = ethers.utils.parseUnits("100.0", 18);
    console.log(mtt);
    const tx = erc20_w.transfer(inputErc20Address, mtt);
  };

  //Mint NFT
  const mintClick = async () => {
    const tx = erc721_w.mintNFT(inputErc721Address, inputMeta);
  };

  //get My NFT
  const getNftClick = async () => {
    const tx = await erc721_r.balanceOf(userAddress);
    console.log(tx);

    listTokensOfOwner();
  };

  const handleChange = (e) => {
    const { value, name } = e.target; 
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const listTokensOfOwner = async() => {
    const sentLogs = await erc721_r.queryFilter(erc721_r.filters.Transfer(userAddress,null));
    console.log(sentLogs);

    const receivedLogs = await erc721_r.queryFilter(erc721_r.filters.Transfer(null, userAddress));
    console.log(receivedLogs);

    const logs = sentLogs.concat(receivedLogs).sort(
      (a, b) =>
        a.blockNumber - b.blockNumber ||
        a.transactionIndex - b.TransactionIndex,
    );;
    console.log(logs);
    const owned = [];

    for (const log of logs) {
      const { from, to, tokenId } = log.args;
      
      if (addressEqual(to, userAddress)) {
        owned.push(tokenId.toString());
      } else if (addressEqual(from, userAddress)) {
        owned.delete(tokenId.toString());
      }
    }
    setMyNftList([...owned]);
    console.log(myNftList);
  }

  const addressEqual = (to,account)=> {
    if(to.toLowerCase()===account.toLowerCase())return true;
    else return false;
  }
  return (
    <div className="App">
      <header className="App-header">ETH TEST</header>
      <body>
        <label>My Address : {userAddress} </label>
        <br />
        <br />
        <label>토큰정보 : {tokenName} </label>
        <button onClick={myTokenGetClick}>발행한 토큰 정보 가져오기</button>
        <br />
        <br />
        <label>현재 소유하고 있는 토큰 수 : {tokenCount} </label>
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

        <br/>
        <button onClick={getNftClick}>myNFT 조회</button>
        <br/>
        {myNftList&&myNftList.map((data)=>{
          return <p>{data}</p>
        })}

      </body>
    </div>
  );
}

export default App;
