import { ethers } from "ethers";

const ethConnect = async() => {
    let erc20_r = undefined;
    let userAddress = undefined;
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        userAddress = await signer.getAddress();
  
        //ERC-20 정보 가져오기
        const erc20Artifact = require("../contracts/MyToken.json");
        const erc20Abi = erc20Artifact.abi;
        const erc20ContractAddress = process.env.REACT_APP_ERC20_CONTRACT_ADDRESS;
  
        //ERC-721 정보 가져오기
        const erc721Artifact = require("../contracts/MyNFT.json");
        const erc721Abi = erc721Artifact.abi;
        const erc721ContractAddress = process.env.REACT_APP_ERC721_CONTRACT_ADDRESS;
  
        erc20_r = new ethers.Contract(erc20ContractAddress, erc20Abi, provider);
        const erc20_w = new ethers.Contract(erc20ContractAddress, erc20Abi, signer)
        const erc721_r = new ethers.Contract(erc721ContractAddress, erc721Abi, provider)
        const erc721_w = new ethers.Contract(erc721ContractAddress, erc721Abi, signer)
      
        return {
            provider,
            signer,
            userAddress,
            erc20_r,
            erc20_w,
            erc721_r,
            erc721_w
        };

      } else {
        alert("Metamask install please");
        window.location.href =
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      }

  };
  
  export { ethConnect };