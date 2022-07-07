import CaverExtKAS from 'caver-js-ext-kas'

const klaytnConnect = async() => {
  //const accessKeyId = process.env.REACT_APP_KLAYTN_ACCESS_KEY;
  //const secretAccessKey = process.env.REACT_APP_KLAYTN_SECRET_KEY;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const caver = new CaverExtKAS(chainId, 'KASKHACDGHB9TSI9IH2XSGRR', 'aqYRPUBSb_npZusZalGvg3uXVVf3U1Rfe3LX9Mwz');
  return caver;
};

export { klaytnConnect };