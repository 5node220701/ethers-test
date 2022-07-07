import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { ethConnect } from '../src/function/myEth'
import { klaytnConnect } from '../src/function/myKlaytn'
function App() {
  //const [provider, setProvider]  = useState();
  //const [signer, setSigner]  = useState();
  const [tokenName, setTokenName] = useState("NULL");
  const [tokenCount, setTokenCount] = useState();
  const [userAddress, setUserAddress] = useState();

  const [erc20_r, setErc20_r] = useState();
  const [erc20_w, setErc20_w] = useState();

  const [erc721_r, setErc721_r] = useState();
  const [erc721_w, setErc721_w] = useState();
  const [myNftList, setMyNftList] = useState();
  const [myKIP37List, setMyKIP37List] = useState();
  const [myKIP37TokenList, setMyKIP37TokenList] = useState();
  const [myKIP37BalanceList, setMyKIP37BalanceList] = useState();
  const [klaytnAddress, setKlaytnAddress] = useState();
  const [caver, setCaver] = useState();

  const [inputs, setInputs] = useState({
    inputErc20Address: '',
    inputErc721Address: '',
    inputMeta: '',
    inputKIP37Alias: '',
    inputKlaytnAddress: '',
    inputKlaytnToAddress: '',
  });

  const [klaytnBlockNumber, setKlaytnBlockNumber] = useState();

  const { inputErc20Address, inputErc721Address, inputMeta, inputKIP37Alias, inputKlaytnAddress, inputKlaytnToAddress } = inputs; // 비구조화 할당을 통해 값 추출

  //초기 동작 메타마스크 자동 실행
  useEffect(() => {
    initEth();
    initKlaytn();
  }, []);

  //ganache
  const initEth = async () => {
    const {userAddress, erc20_r, erc20_w, erc721_r, erc721_w} =  await ethConnect();
    
    //setProvider(provider);
    //setSigner(signer);
    setUserAddress(userAddress);

    //read 전용
    setErc20_r(erc20_r);
    //write 전용
    setErc20_w(erc20_w);
    //read 전용
    setErc721_r(erc721_r);
    //read, write 전용
    setErc721_w(erc721_w);

  };

  const initKlaytn = async () => {
    setCaver(await klaytnConnect());

  };

  //내 토큰 정보받아오기
  const myTokenGetClick = async () => {

    setTokenCount((await erc20_r.balanceOf(userAddress)).toString());
    setTokenName(await erc20_r.symbol());

  };

  //토큰 전송
  const transformClick = async () => {
    // Each mtt has 18 decimal places
    // 단위 변경
    const mtt = ethers.utils.parseUnits("100.0", 18);

    const tx = erc20_w.transfer(inputErc20Address, mtt);

    console.log(tx);
  };

  //Mint NFT
  const mintClick = async () => {
    const tx = erc721_w.mintNFT(inputErc721Address, inputMeta);
    console.log(tx);
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

  //자기가 소유한 NFT 아이디 가져오기. 해당 ID로 NFT조회 연결 가능
  //moralis API로 대체 가능
  const listTokensOfOwner = async() => {
    const sentLogs = await erc721_r.queryFilter(erc721_r.filters.Transfer(userAddress,null));
    const receivedLogs = await erc721_r.queryFilter(erc721_r.filters.Transfer(null, userAddress));

    const logs = sentLogs.concat(receivedLogs).sort(
      (a, b) =>
        a.blockNumber - b.blockNumber ||
        a.transactionIndex - b.TransactionIndex,
    );;

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

  //-------KLAYTN----------------
  const getKlaytnBlockNumber = async() =>{
    const blockNumber = await caver.rpc.klay.getBlockNumber()
    setKlaytnBlockNumber(blockNumber);
  }

  const deployKIP37 = async() =>{
    console.log(inputKIP37Alias);
    const result = await caver.kas.kip37.deploy('https://token-cdn-domain/{id}.json', inputKIP37Alias, {userFeePayer:{
      krn:"krn:1001:wallet:f791b09e-3c10-462a-92df-f5afe79dbc88:feepayer-pool:my",
      address:"0xd8761Eb503dde36d9196798984adCe456378f82F"
    }})
    console.log(result);
  }

  const getKIP37List = async() =>{
    const list = await caver.kas.kip37.getContractList()
    console.log(list.items);
    setMyKIP37List(list.items);
  }

  const createKIP37Token = async() =>{
    const created = await caver.kas.kip37.create(inputKIP37Alias, '0x3', '0x100000', 'https://token-cdn-domain/my-djLee.json')
    console.log(created);
  }

  const getKIP37TokenList = async() =>{
    const tokens = await caver.kas.kip37.getTokenList(inputKIP37Alias);
    setMyKIP37TokenList(tokens.items);
    console.log(tokens);
  }
  
  const addMintToken = async() =>{
    console.log(inputKIP37Alias);
    console.log(klaytnAddress);
    const minted = await caver.kas.kip37.mint(inputKIP37Alias, klaytnAddress, ['0x3'], ['0x1000'])
    console.log(minted);
  }

  const getTokenListByOwner = async() =>{
    const list = await caver.kas.kip37.getTokenListByOwner(inputKIP37Alias, inputKlaytnAddress)
    console.log(list);
    setMyKIP37BalanceList(list.items);
  }
  const transferKIP37 = async() =>{
    console.log(inputKIP37Alias);
    console.log(inputKlaytnAddress);
    console.log(inputKlaytnToAddress);
    const result = await caver.kas.kip37.transfer(inputKIP37Alias,inputKlaytnAddress,inputKlaytnAddress, inputKlaytnToAddress, ['0x3'], ['0x100'])
    
    console.log(result);
  }
  const burnKIP37 = async() =>{
    const result = await caver.kas.kip37.burn(inputKIP37Alias, ['0x3'], ['0x200']);
    console.log(result);
  }

  const getKlaytnAddress = async() =>{
    const list = await caver.kas.wallet.getAccountList()
    console.log(list.items);
    setKlaytnAddress('0xf3908bd0201d2cad28afe411d740a81f006d3e8e');
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
          name="inputErc20Address"
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
          name="inputMeta"
          onChange={handleChange}
          value={inputMeta}
        ></input>
        <br />
        <label>전송할 주소 </label>
        <input
          type="text"
          name="inputErc721Address"
          onChange={handleChange}
          value={inputErc721Address}
        ></input>
        <button onClick={mintClick}>전송</button>

        <br />
        <button onClick={getNftClick}>myNFT 조회</button>
        <br />
        {myNftList &&
          myNftList.map((data, index) => {
            return <p key={index}>{data}</p>;
          })}

        <br />
        <br />
        <header className="App-header">Klaytn KIP37(ERC-1155)</header>
        <label>Klaytn Block Number: {klaytnBlockNumber} </label>
        <button onClick={getKlaytnBlockNumber}>klaytn 블록조회</button>
        <br />
        <br />
        <label>Klaytn Address: {klaytnAddress} </label>
        <button onClick={getKlaytnAddress}>klaytn 주소 조회</button>
        <br />
        <br />
        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <button onClick={deployKIP37}>KIP37 배포</button>
        <br />
        <br />
        <button onClick={getKIP37List}>나의 KIP37 목록 조회</button>
        <br />
        {myKIP37List &&
          myKIP37List.map((data, index) => {
            return <p key={index}>{data.alias}</p>;
          })}
        <br />
        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <button onClick={createKIP37Token}>해당 KIP37의 토큰 발행</button>
        <br />

        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <button onClick={getKIP37TokenList}>
          해당 KIP37의 토큰 정보 가져오기
        </button>
        <br />
        {myKIP37TokenList &&
          myKIP37TokenList.map((data,index) => {
            return (
              <p key={index}>
                {data.tokenId}, {data.tokenUri}, {data.totalSupply}
              </p>
            );
          })}

        <br />

        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <button onClick={addMintToken}>토큰 추가 발행</button>
        <br />
        <br />
        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <label>Klaytn Address</label>
        <input
          type="text"
          name="inputKlaytnAddress"
          onChange={handleChange}
          value={inputKlaytnAddress}
        ></input>
        <button onClick={getTokenListByOwner}>토큰 소유 조회</button>
        <br />
        {myKIP37BalanceList &&
          myKIP37BalanceList.map((data,index) => {
            return (
              <p key={index}>
                토큰 수량:{data.balance}, 토큰 URI:{data.tokenUri}, 날짜:
                {data.updatedAt}
              </p>
            );
          })}

        <br />

        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <label>Klaytn Owner Address</label>
        <input
          type="text"
          name="inputKlaytnAddress"
          onChange={handleChange}
          value={inputKlaytnAddress}
        ></input>
        <label>Klaytn To Address</label>
        <input
          type="text"
          name="inputKlaytnToAddress"
          onChange={handleChange}
          value={inputKlaytnToAddress}
        ></input>
        <button onClick={transferKIP37}>토큰 전송</button>

        <br />
        <br />
        <label>Alias </label>
        <input
          type="text"
          name="inputKIP37Alias"
          onChange={handleChange}
          value={inputKIP37Alias}
        ></input>
        <button onClick={burnKIP37}>토큰 소각</button>
      </body>
    </div>
  );
}

export default App;
