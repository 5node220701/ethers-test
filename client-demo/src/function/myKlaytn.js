import CaverExtKAS from 'caver-js-ext-kas'

const klaytnConnect = async() => {
  const accessKeyId = process.env.REACT_APP_KLAYTN_ACCESS_KEY;
  const secretAccessKey = process.env.REACT_APP_KLAYTN_SECRET_KEY;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const caver = new CaverExtKAS(chainId, 'KASK1RZL14N3D54H66FG90KX', 'pEe2S0tiR0Lx3FXMmz7J0tisNPIoxnbanNcyZSut');
  return caver;
};

export { klaytnConnect };